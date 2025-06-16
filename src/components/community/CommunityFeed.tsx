
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, MessageCircle, Share2, Plus, Clock, TrendingUp, Users, BookOpen, Coffee, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  post_type: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_id: string;
  study_hall_id?: string;
  images: string[];
  is_pinned: boolean;
}

interface CommunityComment {
  id: string;
  content: string;
  likes_count: number;
  created_at: string;
  user_id: string;
  post_id: string;
  images: string[];
}

const CommunityFeed = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [comments, setComments] = useState<{ [key: string]: CommunityComment[] }>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();
  const { userProfile } = useAuth();

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    post_type: 'general'
  });

  const postTypes = [
    { value: 'general', label: 'General Discussion', icon: MessageCircle },
    { value: 'study_tips', label: 'Study Tips', icon: BookOpen },
    { value: 'events', label: 'Events & Meetups', icon: Users },
    { value: 'break_time', label: 'Break Time Chat', icon: Coffee },
    { value: 'help', label: 'Need Help', icon: AlertTriangle }
  ];

  const anonymousNames = [
    'StudyBuddy', 'BookWorm', 'NightOwl', 'CoffeeAddict', 'QuietLearner',
    'FocusedMind', 'StudyHero', 'BrainPower', 'LearningNinja', 'StudyStar'
  ];

  const getAnonymousName = (userId: string) => {
    const hash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return anonymousNames[Math.abs(hash) % anonymousNames.length];
  };

  const getAnonymousAvatar = (userId: string) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500', 'bg-yellow-500', 'bg-red-500'];
    const hash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load community posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('community_comments')
        .select('*')
        .eq('post_id', postId)
        .eq('is_approved', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(prev => ({ ...prev, [postId]: data || [] }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const createPost = async () => {
    if (!userProfile?.id || !newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('community_posts')
        .insert([{
          title: newPost.title,
          content: newPost.content,
          post_type: newPost.post_type,
          user_id: userProfile.user_id
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your post has been submitted for approval"
      });

      setNewPost({ title: '', content: '', post_type: 'general' });
      setIsCreatePostOpen(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
    }
  };

  const addComment = async (postId: string) => {
    if (!userProfile?.id || !newComment.trim()) return;

    try {
      const { error } = await supabase
        .from('community_comments')
        .insert([{
          content: newComment,
          post_id: postId,
          user_id: userProfile.user_id
        }]);

      if (error) throw error;

      setNewComment('');
      fetchComments(postId);
      
      // Update comments count
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, comments_count: post.comments_count + 1 }
          : post
      ));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const likePost = async (postId: string) => {
    // Simulate like functionality - in real app, you'd track user likes
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes_count: post.likes_count + 1 }
        : post
    ));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post => 
    activeTab === 'all' || post.post_type === activeTab
  );

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Post Button */}
      <Card>
        <CardContent className="p-4">
          <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Share something with the community (Anonymous)
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="post-type">Post Type</Label>
                  <Select value={newPost.post_type} onValueChange={(value) => setNewPost(prev => ({ ...prev, post_type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {postTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Give your post a catchy title..."
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your thoughts, ask questions, or start a discussion..."
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    rows={6}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsCreatePostOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createPost}>
                    Post Anonymously
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Filter Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeTab === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('all')}
            >
              All Posts
            </Button>
            {postTypes.map(type => (
              <Button
                key={type.value}
                variant={activeTab === type.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(type.value)}
                className="flex items-center gap-1"
              >
                <type.icon className="h-3 w-3" />
                {type.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Posts Yet</h3>
              <p className="text-gray-600">Be the first to start a conversation in the community!</p>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Post Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className={`w-10 h-10 ${getAnonymousAvatar(post.user_id)}`}>
                        <AvatarFallback className="text-white font-semibold">
                          {getAnonymousName(post.user_id).slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{getAnonymousName(post.user_id)}</span>
                          {post.is_pinned && (
                            <Badge variant="secondary" className="text-xs">Pinned</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(post.created_at)}</span>
                          <Badge variant="outline" className="text-xs">
                            {postTypes.find(t => t.value === post.post_type)?.label || 'General'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                  </div>

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => likePost(post.id)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <Heart className="h-4 w-4" />
                        <span className="text-sm">{post.likes_count}</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPost(post);
                          fetchComments(post.id);
                        }}
                        className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-sm">{post.comments_count}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500 transition-colors">
                        <Share2 className="h-4 w-4" />
                        <span className="text-sm">Share</span>
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  {selectedPost?.id === post.id && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      <h4 className="font-medium">Comments</h4>
                      
                      {/* Add Comment */}
                      <div className="flex space-x-3">
                        <Avatar className={`w-8 h-8 ${getAnonymousAvatar(userProfile?.user_id || '')}`}>
                          <AvatarFallback className="text-white text-sm">
                            {getAnonymousName(userProfile?.user_id || '').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <Textarea
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            rows={2}
                          />
                          <div className="flex justify-end">
                            <Button 
                              size="sm" 
                              onClick={() => addComment(post.id)}
                              disabled={!newComment.trim()}
                            >
                              Comment
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Comments List */}
                      <div className="space-y-3">
                        {comments[post.id]?.map((comment) => (
                          <div key={comment.id} className="flex space-x-3">
                            <Avatar className={`w-8 h-8 ${getAnonymousAvatar(comment.user_id)}`}>
                              <AvatarFallback className="text-white text-sm">
                                {getAnonymousName(comment.user_id).slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-sm">{getAnonymousName(comment.user_id)}</span>
                                  <span className="text-xs text-gray-500">{formatTimeAgo(comment.created_at)}</span>
                                </div>
                                <p className="text-gray-700 text-sm">{comment.content}</p>
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <button className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-500">
                                  <Heart className="h-3 w-3" />
                                  <span>{comment.likes_count}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityFeed;
