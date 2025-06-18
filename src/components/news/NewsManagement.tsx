import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Filter, Eye, Edit, Trash2, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import NewsEditor from './NewsEditor';
import NewsAnalytics from './NewsAnalytics';

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  video_url?: string;
  status: string;
  is_featured: boolean;
  is_breaking: boolean;
  published_at?: string;
  views_count: number;
  likes_count: number;
  comments_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  news_categories?: {
    name: string;
    color: string;
  } | null;
  user_profiles?: {
    full_name: string;
  } | null;
}

const NewsManagement: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchArticles();
  }, [statusFilter]);

  const fetchArticles = async () => {
    try {
      let query = supabase
        .from('news_articles')
        .select(`
          *,
          news_categories(name, color),
          user_profiles(full_name)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;

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
        description: "Failed to fetch articles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (articleId: string, newStatus: string) => {
    try {
      const updates: any = { status: newStatus };
      if (newStatus === 'published') {
        updates.published_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('news_articles')
        .update(updates)
        .eq('id', articleId);

      if (error) throw error;

      await fetchArticles();
      toast({
        title: "Success",
        description: `Article ${newStatus} successfully`
      });
    } catch (error) {
      console.error('Error updating article status:', error);
      toast({
        title: "Error",
        description: "Failed to update article status",
        variant: "destructive"
      });
    }
  };

  const handleFeatureToggle = async (articleId: string, isFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('news_articles')
        .update({ is_featured: !isFeatured })
        .eq('id', articleId);

      if (error) throw error;

      await fetchArticles();
      toast({
        title: "Success",
        description: `Article ${!isFeatured ? 'featured' : 'unfeatured'} successfully`
      });
    } catch (error) {
      console.error('Error toggling feature status:', error);
      toast({
        title: "Error",
        description: "Failed to update feature status",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (articleId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const { error } = await supabase
        .from('news_articles')
        .delete()
        .eq('id', articleId);

      if (error) throw error;

      await fetchArticles();
      toast({
        title: "Success",
        description: "Article deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isEditorOpen) {
    return (
      <NewsEditor
        article={editingArticle}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingArticle(null);
          fetchArticles();
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News Management</h1>
          <p className="text-gray-600">Create and manage news articles</p>
        </div>
        <Button 
          onClick={() => setIsEditorOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Article
        </Button>
      </div>

      <Tabs defaultValue="articles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                  <p>Loading articles...</p>
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No articles found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredArticles.map((article) => (
                    <div key={article.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-lg">{article.title}</h3>
                            {article.is_featured && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                            {article.is_breaking && (
                              <Badge variant="destructive" className="text-xs">BREAKING</Badge>
                            )}
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-2">
                            {article.excerpt || article.content.substring(0, 150) + '...'}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>By {article.user_profiles?.full_name || 'Unknown'}</span>
                            {article.news_categories && (
                              <Badge 
                                style={{ backgroundColor: article.news_categories.color + '20', color: article.news_categories.color }}
                                variant="secondary"
                              >
                                {article.news_categories.name}
                              </Badge>
                            )}
                            <span>{formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}</span>
                          </div>
                          
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Eye className="h-3 w-3" />
                              <span>{article.views_count}</span>
                            </div>
                            <span>❤️ {article.likes_count}</span>
                            <span>💬 {article.comments_count}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(article.status)}>
                            {article.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center space-x-2">
                          {article.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              #{tag}
                            </span>
                          ))}
                          {article.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{article.tags.length - 3} more</span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {article.status === 'draft' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(article.id, 'published')}
                            >
                              Publish
                            </Button>
                          )}
                          {article.status === 'published' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleStatusChange(article.id, 'archived')}
                            >
                              Archive
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFeatureToggle(article.id, article.is_featured)}
                          >
                            <Star className={`h-3 w-3 ${article.is_featured ? 'fill-current text-yellow-500' : ''}`} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingArticle(article);
                              setIsEditorOpen(true);
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(article.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <NewsAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsManagement;
