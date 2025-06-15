
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Send, Image as ImageIcon, Paperclip, Users, Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import ImageUploader from '@/components/shared/ImageUploader';

interface ChatRoom {
  id: string;
  name: string;
  type: string;
  description?: string;
  created_at: string;
  lastMessage?: {
    content: string;
    created_at: string;
    sender_name: string;
  };
  unreadCount?: number;
}

interface ChatMessage {
  id: string;
  content?: string;
  message_type: string;
  attachments: string[];
  created_at: string;
  sender_id: string;
  user_profiles: {
    full_name: string;
    avatar_url?: string;
    role: string;
  };
}

const ChatSystem: React.FC = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageImages, setMessageImages] = useState<string[]>([]);
  const [isImageUploaderOpen, setIsImageUploaderOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchChatRooms();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.id);
      // Set up real-time subscription for messages
      const subscription = supabase
        .channel(`room_${selectedRoom.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${selectedRoom.id}`
        }, (payload) => {
          fetchMessages(selectedRoom.id);
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [selectedRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatRooms = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('chat_rooms')
        .select(`
          *,
          chat_participants!inner (
            user_id
          )
        `)
        .eq('chat_participants.user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setChatRooms(data || []);
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      toast({
        title: "Error",
        description: "Failed to fetch chat rooms",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (roomId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          user_profiles (
            full_name,
            avatar_url,
            role
          )
        `)
        .eq('room_id', roomId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!selectedRoom || (!newMessage.trim() && messageImages.length === 0)) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to send messages",
          variant: "destructive"
        });
        return;
      }

      const messageData = {
        room_id: selectedRoom.id,
        sender_id: user.id,
        content: newMessage.trim() || null,
        message_type: messageImages.length > 0 ? 'image' : 'text',
        attachments: messageImages
      };

      const { error } = await supabase
        .from('chat_messages')
        .insert([messageData]);

      if (error) throw error;

      // Update room's updated_at timestamp
      await supabase
        .from('chat_rooms')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', selectedRoom.id);

      setNewMessage('');
      setMessageImages([]);
      setIsImageUploaderOpen(false);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getRoomTypeIcon = (type: string) => {
    switch (type) {
      case 'group': return <Users className="h-4 w-4" />;
      case 'broadcast': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
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
    return <div className="flex justify-center p-8">Loading chat rooms...</div>;
  }

  return (
    <div className="h-[80vh] flex">
      {/* Chat Rooms Sidebar */}
      <div className="w-1/3 border-r bg-white">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Messages</h3>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </div>
        </div>

        <div className="overflow-y-auto h-full">
          {chatRooms.map((room) => (
            <div
              key={room.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedRoom?.id === room.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
              onClick={() => setSelectedRoom(room)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {getRoomTypeIcon(room.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm truncate">{room.name}</h4>
                    {room.unreadCount && room.unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {room.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {room.lastMessage?.content || 'No messages yet'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {room.lastMessage ? 
                      formatDistanceToNow(new Date(room.lastMessage.created_at), { addSuffix: true }) :
                      formatDistanceToNow(new Date(room.created_at), { addSuffix: true })
                    }
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  {getRoomTypeIcon(selectedRoom.type)}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedRoom.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{selectedRoom.type} chat</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div key={message.id} className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={message.user_profiles?.avatar_url} />
                    <AvatarFallback>
                      {message.user_profiles?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 max-w-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{message.user_profiles?.full_name}</span>
                      <Badge className={getRoleColor(message.user_profiles?.role)} variant="secondary" size="sm">
                        {message.user_profiles?.role}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      {message.content && (
                        <p className="text-sm text-gray-800 whitespace-pre-wrap">
                          {message.content}
                        </p>
                      )}
                      
                      {/* Message Images */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {message.attachments.map((attachment, index) => (
                            <img
                              key={index}
                              src={attachment}
                              alt={`Attachment ${index + 1}`}
                              className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => {/* Open image modal */}}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              {/* Image Previews */}
              {messageImages.length > 0 && (
                <div className="mb-3 flex gap-2">
                  {messageImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-5 h-5 p-0"
                        onClick={() => setMessageImages(prev => prev.filter((_, i) => i !== index))}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsImageUploaderOpen(true)}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="resize-none"
                  />
                </div>
                <Button onClick={sendMessage} disabled={!newMessage.trim() && messageImages.length === 0}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600">Select a conversation</h3>
              <p className="text-gray-500">Choose a chat room to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Image Uploader Dialog */}
      <Dialog open={isImageUploaderOpen} onOpenChange={setIsImageUploaderOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Images to Message</DialogTitle>
          </DialogHeader>
          
          <ImageUploader
            onImagesUploaded={(urls) => {
              setMessageImages(prev => [...prev, ...urls]);
              setIsImageUploaderOpen(false);
            }}
            currentImages={[]}
            maxImages={5}
            folder="chat"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatSystem;
