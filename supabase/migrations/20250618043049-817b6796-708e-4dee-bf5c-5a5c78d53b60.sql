
-- Fix the foreign key relationship between news_articles and user_profiles
-- First, let's add the proper foreign key constraint if it doesn't exist
ALTER TABLE public.news_articles 
ADD CONSTRAINT fk_news_articles_author 
FOREIGN KEY (author_id) REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Create a view that properly joins news_articles with user_profiles
CREATE OR REPLACE VIEW news_articles_with_profiles AS
SELECT 
  na.*,
  up.full_name as author_name,
  up.avatar_url as author_avatar,
  nc.name as category_name,
  nc.color as category_color
FROM news_articles na
LEFT JOIN user_profiles up ON na.author_id = up.user_id
LEFT JOIN news_categories nc ON na.category_id = nc.id;

-- Grant access to the view
GRANT SELECT ON news_articles_with_profiles TO authenticated;
GRANT SELECT ON news_articles_with_profiles TO anon;
