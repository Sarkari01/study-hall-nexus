
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Eye, Heart, MessageSquare, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  totalArticles: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  publishedArticles: number;
  draftArticles: number;
  topArticles: any[];
  viewsOverTime: any[];
  categoryStats: any[];
}

const NewsAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalArticles: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    publishedArticles: 0,
    draftArticles: 0,
    topArticles: [],
    viewsOverTime: [],
    categoryStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch basic stats
      const { data: articles, error: articlesError } = await supabase
        .from('news_articles')
        .select(`
          *,
          news_categories(name, color)
        `);

      if (articlesError) throw articlesError;

      const totalArticles = articles?.length || 0;
      const totalViews = articles?.reduce((sum, article) => sum + (article.views_count || 0), 0) || 0;
      const totalLikes = articles?.reduce((sum, article) => sum + (article.likes_count || 0), 0) || 0;
      const totalComments = articles?.reduce((sum, article) => sum + (article.comments_count || 0), 0) || 0;
      const publishedArticles = articles?.filter(a => a.status === 'published').length || 0;
      const draftArticles = articles?.filter(a => a.status === 'draft').length || 0;

      // Top articles by views
      const topArticles = articles
        ?.sort((a, b) => (b.views_count || 0) - (a.views_count || 0))
        .slice(0, 5)
        .map(article => ({
          title: article.title,
          views: article.views_count || 0,
          likes: article.likes_count || 0,
          comments: article.comments_count || 0
        })) || [];

      // Views over time (last 7 days)
      const viewsOverTime = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        // In a real app, you'd query news_views table for actual data
        viewsOverTime.push({
          date: dayName,
          views: Math.floor(Math.random() * 100) + 20
        });
      }

      // Category stats
      const categoryMap = new Map();
      articles?.forEach(article => {
        if (article.news_categories) {
          const category = article.news_categories.name;
          if (categoryMap.has(category)) {
            categoryMap.set(category, categoryMap.get(category) + 1);
          } else {
            categoryMap.set(category, 1);
          }
        }
      });

      const categoryStats = Array.from(categoryMap.entries()).map(([name, value]) => ({
        name,
        value,
        color: articles?.find(a => a.news_categories?.name === name)?.news_categories?.color || '#3B82F6'
      }));

      setAnalytics({
        totalArticles,
        totalViews,
        totalLikes,
        totalComments,
        publishedArticles,
        draftArticles,
        topArticles,
        viewsOverTime,
        categoryStats
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalViews.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Heart className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalLikes.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Comments</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalComments.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published Articles</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.publishedArticles}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Views Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.viewsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Articles by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.categoryStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Articles */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topArticles.map((article, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{article.title}</h4>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{article.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{article.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{article.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsAnalytics;
