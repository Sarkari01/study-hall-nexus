import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Heart, MessageSquare, Share2, Clock, Star, Play, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  video_url?: string;
  is_featured: boolean;
  is_breaking: boolean;
  published_at: string;
  views_count: number;
  likes_count: number;
  comments_count: number;
  tags: string[];
  news_categories?: {
    name: string;
    color: string;
  } | null;
  user_profiles?: {
    full_name: string;
    avatar_url?: string;
  } | null;
}

const StudentNewsFeed: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<any[]>([]);
  const [likedArticles, setLikedArticles] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, selectedCategory]);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select(`
          *,
          news_categories(name, color),
          user_profiles(full_name, avatar_url)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (error) throw error;

      // Type assertion to handle the Supabase response
      const typedArticles = (data || []).map(article => ({
        ...article,
        user_profiles: article.user_profiles && typeof article.user_profiles === 'object' && 'full_name' in article.user_profiles 
          ? article.user_profiles 
          : null,
        news_categories: article.news_categories && typeof article.news_categories === 'object' && 'name' in article.news_categories
          ? article.news_categories
          : null
      })) as NewsArticle[];

      setArticles(typedArticles);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch news articles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('news_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => 
        article.news_categories?.name === selectedCategory
      );
    }

    // Sort featured and breaking news first
    filtered.sort((a, b) => {
      if (a.is_breaking && !b.is_breaking) return -1;
      if (!a.is_breaking && b.is_breaking) return 1;
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });

    setFilteredArticles(filtered);
  };

  const handleLike = async (articleId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Please log in to like articles",
          variant: "destructive"
        });
        return;
      }

      const isLiked = likedArticles.has(articleId);

      if (isLiked) {
        const { error } = await supabase
          .from('news_likes')
          .delete()
          .eq('article_id', articleId)
          .eq('user_id', user.id);

        if (error) throw error;

        setLikedArticles(prev => {
          const newSet = new Set(prev);
          newSet.delete(articleId);
          return newSet;
        });
      } else {
        const { error } = await supabase
          .from('news_likes')
          .insert([{
            article_id: articleId,
            user_id: user.id
          }]);

        if (error) throw error;

        setLikedArticles(prev => new Set(prev).add(articleId));
      }

      // Update local article likes count
      setArticles(prev => prev.map(article => 
        article.id === articleId 
          ? { 
              ...article, 
              likes_count: article.likes_count + (isLiked ? -1 : 1)
            }
          : article
      ));

    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive"
      });
    }
  };

  const handleViewArticle = async (articleId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Record view
      await supabase
        .from('news_views')
        .insert([{
          article_id: articleId,
          user_id: user?.id || null,
          ip_address: null,
          user_agent: navigator.userAgent
        }]);

      // Update local views count
      setArticles(prev => prev.map(article => 
        article.id === articleId 
          ? { ...article, views_count: article.views_count + 1 }
          : article
      ));
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p>Loading news...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Latest News</h1>
        <p className="text-gray-600">Stay updated with the latest news and announcements</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
            className="whitespace-nowrap"
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.name ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.name)}
              className="whitespace-nowrap"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div className="space-y-6">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No articles found</p>
          </div>
        ) : (
          filteredArticles.map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="p-6">
                  {/* Article Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={article.user_profiles?.avatar_url} />
                        <AvatarFallback>
                          {article.user_profiles?.full_name?.charAt(0) || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {article.user_profiles?.full_name || 'Admin'}
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {article.is_breaking && (
                        <Badge variant="destructive" className="animate-pulse">
                          BREAKING
                        </Badge>
                      )}
                      {article.is_featured && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                  </div>

                  {/* Title and Category */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      {article.news_categories && (
                        <Badge 
                          style={{ 
                            backgroundColor: article.news_categories.color + '20', 
                            color: article.news_categories.color 
                          }}
                          variant="secondary"
                        >
                          {article.news_categories.name}
                        </Badge>
                      )}
                    </div>
                    <h2 
                      className="text-xl font-bold text-gray-900 mb-2 cursor-pointer hover:text-emerald-600"
                      onClick={() => handleViewArticle(article.id)}
                    >
                      {article.title}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {article.excerpt || article.content.substring(0, 200) + '...'}
                    </p>
                  </div>

                  {/* Media */}
                  {article.featured_image_url && (
                    <div className="mb-4">
                      <img
                        src={article.featured_image_url}
                        alt={article.title}
                        className="w-full h-64 object-cover rounded-lg cursor-pointer"
                        onClick={() => handleViewArticle(article.id)}
                      />
                    </div>
                  )}

                  {article.video_url && (
                    <div className="mb-4">
                      <div className="relative bg-gray-100 rounded-lg h-64 flex items-center justify-center cursor-pointer">
                        <Play className="h-12 w-12 text-gray-400" />
                        <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                          Video
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {article.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {article.tags.slice(0, 3).map((tag, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs cursor-pointer hover:bg-gray-200"
                          >
                            #{tag}
                          </span>
                        ))}
                        {article.tags.length > 3 && (
                          <span className="text-xs text-gray-500">+{article.tags.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(article.id)}
                        className={`flex items-center space-x-1 ${
                          likedArticles.has(article.id) ? 'text-red-500' : 'text-gray-500'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${likedArticles.has(article.id) ? 'fill-current' : ''}`} />
                        <span>{article.likes_count}</span>
                      </Button>

                      <div className="flex items-center space-x-1 text-gray-500">
                        <MessageSquare className="h-4 w-4" />
                        <span>{article.comments_count}</span>
                      </div>

                      <div className="flex items-center space-x-1 text-gray-500">
                        <Eye className="h-4 w-4" />
                        <span>{article.views_count}</span>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm" className="text-gray-500">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentNewsFeed;
