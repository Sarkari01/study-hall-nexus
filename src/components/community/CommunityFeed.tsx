
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, MessageCircle, Share2, Pin, Plus, Image as ImageIcon, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import ImageUploader from '@/components/shared/ImageUploader';

interface Post {
  id: string;
  title: string;
  content: string;
  images: string[];
  post_type: string;
  is_pinned: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_profiles: {
    full_name: string;
    avatar_url?: string;
    role: string;
  };
}

interface Comment {
  id: string;
  content: string;
  images: string[];
  likes_count: number;
  created_at: string;
  user_profiles: {
    full_name: string;
    avatar_url?: string;
    role: string;
  };
}

const CommunityFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentImages, setCommentImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Post form state
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    post_type: 'general',
    images: [] as string[]
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          user_profiles (
            full_name,
            avatar_url,
            role
          )
        `)
        .eq('is_approved', true)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch community posts",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('community_comments')
        .select(`
          *,
          user_profiles (
            full_name,
            avatar_url,
            role
          )
        `)
        .eq('post_id', postId)
        .eq('is_approved', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to create posts",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('community_posts')
        .insert([{
          ...postForm,
          user_id: user.id
        }]);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Post created successfully"
      });
      
      setIsPostFormOpen(false);
      resetPostForm();
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

  const handleAddComment = async () => {
    if (!selectedPost || (!newComment.trim() && commentImages.length === 0)) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to comment",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('community_comments')
        .insert([{
          post_id: selectedPost.id,
          user_id: user.id,
          content: newComment,
          images: commentImages
        }]);

      if (error) throw error;
      
      setNewComment('');
      setCommentImages([]);
      fetchComments(selectedPost.id);
      
      // Update comments count
      await supabase
        .from('community_posts')
        .update({ 
          comments_count: selectedPost.comments_count + 1 
        })
        .eq('id', selectedPost.id);
        
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    }
  };

  const handleLikePost = async (postId: string, currentLikes: number) => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .update({ likes_count: currentLikes + 1 })
        .eq('id', postId);

      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const resetPostForm = () => {
    setPostForm({
      title: '',
      content: '',
      post_type: 'general',
      images: []
    });
  };

  const openPostDetails = (post: Post) => {
    setSelectedPost(post);
    fetchComments(post.id);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'merchant': return 'bg-blue-100 text-blue-800';
      case 'incharge': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading community posts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Community Feed</h2>
        <Button onClick={() => setIsPostFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Post
        </Button>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={post.user_profiles?.avatar_url} />
                    <AvatarFallback>
                      {post.user_profiles?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{post.user_profiles?.full_name || 'Anonymous'}</h4>
                      <Badge className={getRoleColor(post.user_profiles?.role)} variant="secondary">
                        {post.user_profiles?.role}
                      </Badge>
                      {post.is_pinned && (
                        <Pin className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="capitalize">
                  {post.post_type}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
              </div>

              {/* Post Images */}
              {post.images && post.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {post.images.slice(0, 4).map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Post image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => {/* Open image modal */}}
                      />
                      {index === 3 && post.images.length > 4 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                          <span className="text-white font-semibold">
                            +{post.images.length - 4} more
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLikePost(post.id, post.likes_count)}
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    {post.likes_count}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openPostDetails(post)}
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.comments_count}
                  </Button>
                </div>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Post Dialog */}
      <Dialog open={isPostFormOpen} onOpenChange={setIsPostFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={postForm.title}
                onChange={(e) => setPostForm(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="post_type">Post Type</Label>
              <Select
                value={postForm.post_type}
                onValueChange={(value) => setPostForm(prev => ({ ...prev, post_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Discussion</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="discussion">Topic Discussion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={postForm.content}
                onChange={(e) => setPostForm(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Images (max 5)</Label>
              <ImageUploader
                onImagesUploaded={(urls) => setPostForm(prev => ({ ...prev, images: urls }))}
                currentImages={postForm.images}
                maxImages={5}
                folder="community"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">Create Post</Button>
              <Button type="button" variant="outline" onClick={() => setIsPostFormOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Post Details Dialog */}
      {selectedPost && (
        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedPost.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Post Content */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={selectedPost.user_profiles?.avatar_url} />
                    <AvatarFallback>
                      {selectedPost.user_profiles?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{selectedPost.user_profiles?.full_name}</h4>
                      <Badge className={getRoleColor(selectedPost.user_profiles?.role)} variant="secondary">
                        {selectedPost.user_profiles?.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(selectedPost.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 whitespace-pre-wrap">{selectedPost.content}</p>

                {/* Post Images */}
                {selectedPost.images && selectedPost.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedPost.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Post image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Comments Section */}
              <div className="border-t pt-4 space-y-4">
                <h4 className="font-semibold">Comments ({comments.length})</h4>

                {/* Add Comment */}
                <div className="space-y-3">
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                  />
                  
                  <ImageUploader
                    onImagesUploaded={setCommentImages}
                    currentImages={commentImages}
                    maxImages={3}
                    folder="comments"
                  />

                  <Button onClick={handleAddComment} size="sm">
                    <Send className="h-4 w-4 mr-2" />
                    Post Comment
                  </Button>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={comment.user_profiles?.avatar_url} />
                        <AvatarFallback>
                          {comment.user_profiles?.full_name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{comment.user_profiles?.full_name}</span>
                          <Badge className={getRoleColor(comment.user_profiles?.role)} variant="secondary" size="sm">
                            {comment.user_profiles?.role}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                        
                        {/* Comment Images */}
                        {comment.images && comment.images.length > 0 && (
                          <div className="flex gap-2">
                            {comment.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Comment image ${index + 1}`}
                                className="w-16 h-16 object-cover rounded"
                              />
                            ))}
                          </div>
                        )}

                        <Button variant="ghost" size="sm" className="h-6 text-xs">
                          <Heart className="h-3 w-3 mr-1" />
                          {comment.likes_count}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CommunityFeed;
