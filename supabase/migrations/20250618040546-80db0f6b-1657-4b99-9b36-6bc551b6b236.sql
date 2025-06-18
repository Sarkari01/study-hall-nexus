
-- Create news_categories table
CREATE TABLE public.news_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create news_articles table
CREATE TABLE public.news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  video_url TEXT,
  category_id UUID REFERENCES public.news_categories(id),
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  is_featured BOOLEAN DEFAULT false,
  is_breaking BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news_comments table
CREATE TABLE public.news_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES public.news_articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.news_comments(id),
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news_views table for analytics
CREATE TABLE public.news_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES public.news_articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news_likes table
CREATE TABLE public.news_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES public.news_articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(article_id, user_id)
);

-- Create storage bucket for news media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'news-media',
  'news-media',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg']
);

-- Enable RLS on all tables
ALTER TABLE public.news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_likes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for news_categories
CREATE POLICY "Everyone can view active categories" ON public.news_categories
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON public.news_categories
FOR ALL USING (public.get_user_role_safe(auth.uid()) = 'admin');

-- Create RLS policies for news_articles
CREATE POLICY "Everyone can view published articles" ON public.news_articles
FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage all articles" ON public.news_articles
FOR ALL USING (public.get_user_role_safe(auth.uid()) = 'admin');

CREATE POLICY "Authors can manage their own articles" ON public.news_articles
FOR ALL USING (auth.uid() = author_id);

-- Create RLS policies for news_comments
CREATE POLICY "Everyone can view approved comments" ON public.news_comments
FOR SELECT USING (is_approved = true);

CREATE POLICY "Authenticated users can create comments" ON public.news_comments
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.news_comments
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all comments" ON public.news_comments
FOR ALL USING (public.get_user_role_safe(auth.uid()) = 'admin');

-- Create RLS policies for news_views
CREATE POLICY "Users can create views" ON public.news_views
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all analytics" ON public.news_views
FOR SELECT USING (public.get_user_role_safe(auth.uid()) = 'admin');

-- Create RLS policies for news_likes
CREATE POLICY "Everyone can view likes" ON public.news_likes
FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage their likes" ON public.news_likes
FOR ALL USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Create storage policies for news media
CREATE POLICY "Anyone can view news media" ON storage.objects
FOR SELECT USING (bucket_id = 'news-media');

CREATE POLICY "Admins can upload news media" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'news-media' AND 
  public.get_user_role_safe(auth.uid()) = 'admin'
);

CREATE POLICY "Admins can update news media" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'news-media' AND 
  public.get_user_role_safe(auth.uid()) = 'admin'
);

CREATE POLICY "Admins can delete news media" ON storage.objects
FOR DELETE USING (
  bucket_id = 'news-media' AND 
  public.get_user_role_safe(auth.uid()) = 'admin'
);

-- Create indexes for better performance
CREATE INDEX idx_news_articles_status ON public.news_articles(status);
CREATE INDEX idx_news_articles_category ON public.news_articles(category_id);
CREATE INDEX idx_news_articles_published ON public.news_articles(published_at DESC);
CREATE INDEX idx_news_articles_featured ON public.news_articles(is_featured);
CREATE INDEX idx_news_comments_article ON public.news_comments(article_id);
CREATE INDEX idx_news_views_article ON public.news_views(article_id);
CREATE INDEX idx_news_likes_article ON public.news_likes(article_id);

-- Create function to update article stats
CREATE OR REPLACE FUNCTION update_article_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_TABLE_NAME = 'news_comments' THEN
    UPDATE public.news_articles 
    SET comments_count = (
      SELECT COUNT(*) FROM public.news_comments 
      WHERE article_id = COALESCE(NEW.article_id, OLD.article_id) 
      AND is_approved = true
    )
    WHERE id = COALESCE(NEW.article_id, OLD.article_id);
  END IF;
  
  IF TG_TABLE_NAME = 'news_likes' THEN
    UPDATE public.news_articles 
    SET likes_count = (
      SELECT COUNT(*) FROM public.news_likes 
      WHERE article_id = COALESCE(NEW.article_id, OLD.article_id)
    )
    WHERE id = COALESCE(NEW.article_id, OLD.article_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update article stats
CREATE TRIGGER update_comments_count
  AFTER INSERT OR UPDATE OR DELETE ON public.news_comments
  FOR EACH ROW EXECUTE FUNCTION update_article_stats();

CREATE TRIGGER update_likes_count
  AFTER INSERT OR DELETE ON public.news_likes
  FOR EACH ROW EXECUTE FUNCTION update_article_stats();

-- Insert default news categories
INSERT INTO public.news_categories (name, description, color) VALUES
('General', 'General news and announcements', '#3B82F6'),
('Education', 'Educational news and updates', '#10B981'),
('Events', 'Upcoming events and activities', '#F59E0B'),
('Technology', 'Technology and innovation news', '#8B5CF6'),
('Study Tips', 'Study tips and academic guidance', '#EF4444');
