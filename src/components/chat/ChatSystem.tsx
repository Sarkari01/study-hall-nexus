
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Send, Image as ImageIcon, Users, Plus, Search, AlertCircle } from 'lucide-react';
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
  updated_at?: string;
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
  room_id: string;
  is_deleted: boolean;
  user_profiles?: {
    full_name: string;
    avatar_url?: string;
    role: string;
  } | null;
}

const ChatSystem: React.FC = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageImages, setMessageImages] = useState<string[]>([]);
  const [isImageUploaderOpen, setIsImageUploaderOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.id);
      setupRealtimeSubscription(selectedRoom.id);
    }
  }, [selectedRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      if (!user) {
        setError('Please log in to access chat');
        setIsLoading(false);
        return;
      }

      setCurrentUser(user);
      await fetchChatRooms();
    } catch (error) {
      console.error('Error initializing chat:', error);
      setError('Failed to initialize chat system');
      toast({
        title: "Error",
        description: "Failed to initialize chat system",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = (roomId: string) => {
    const subscription = supabase
      .channel(`room_${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `room_id=eq.${roomId}`
      }, () => {
        fetchMessages(roomId);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatRooms = async () => {
    try {
      if (!currentUser) return;

      // First, try to get rooms where user is a participant
      const { data: roomsData, error: roomsError } = await supabase
        .from('chat_rooms')
        .select('*')
        .order('updated_at', { ascending: false });

      if (roomsError) {
        console.error('Error fetching chat rooms:', roomsError);
        // If there's an error or no rooms, create a default general chat room
        await createDefaultChatRoom();
        return;
      }

      if (!roomsData || roomsData.length === 0) {
        await createDefaultChatRoom();
        return;
      }

      setChatRooms(roomsData || []);
    } catch (error) {
      console.error('Error in fetchChatRooms:', error);
      await createDefaultChatRoom();
    }
  };

  const createDefaultChatRoom = async () => {
    try {
      const { data: newRoom, error } = await supabase
        .from('chat_rooms')
        .insert([{
          name: 'General Chat',
          type: 'group',
          description: 'General discussion room for all users',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      setChatRooms([newRoom]);
      toast({
        title: "Chat room created",
        description: "A general chat room has been created for you"
      });
    } catch (error) {
      console.error('Error creating default chat room:', error);
      setError('Failed to create chat room');
    }
  };

  const fetchMessages = async (roomId: string) => {
    try {
      const { data: messagesData, error: messagesError } = await supabase
        .from('chat_messages')
        .select(`
          *,
          user_profiles!inner(full_name, avatar_url, role)
        `)
        .eq('room_id', roomId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        return;
      }

      setMessages(messagesData || []);
    } catch (error) {
      console.error('Error in fetchMessages:', error);
    }
  };

  const sendMessage = async () => {
    if (!selectedRoom || !currentUser || (!newMessage.trim() && messageImages.length === 0)) return;

    try {
      const messageData = {
        room_id: selectedRoom.id,
        sender_id: currentUser.id,
        content: newMessage.trim() || null,
        message_type: messageImages.length > 0 ? 'image' : 'text',
        attachments: messageImages,
        is_deleted: false
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
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p>Loading chat system...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chat System Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={initializeChat}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[80vh] flex bg-white rounded-lg shadow-sm border">
      {/* Chat Rooms Sidebar */}
      <div className="w-1/3 border-r bg-gray-50">
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Messages</h3>
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
          {chatRooms.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No chat rooms available</p>
            </div>
          ) : (
            chatRooms.map((room) => (
              <div
                key={room.id}
                className={`p-4 border-b cursor-pointer hover:bg-white transition-colors ${
                  selectedRoom?.id === room.id ? 'bg-emerald-50 border-l-4 border-l-emerald-500' : ''
                }`}
                onClick={() => setSelectedRoom(room)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      {getRoomTypeIcon(room.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm truncate text-gray-900">{room.name}</h4>
                      {room.unreadCount && room.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {room.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {room.lastMessage?.content || room.description || 'No messages yet'}
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
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                  {getRoomTypeIcon(selectedRoom.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedRoom.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{selectedRoom.type} chat</p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={message.user_profiles?.avatar_url} />
                      <AvatarFallback className="bg-emerald-100 text-emerald-700">
                        {message.user_profiles?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 max-w-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-gray-900">
                          {message.user_profiles?.full_name || 'Unknown User'}
                        </span>
                        {message.user_profiles?.role && (
                          <Badge className={getRoleColor(message.user_profiles.role)} variant="secondary">
                            {message.user_profiles.role}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 shadow-sm border">
                        {message.content && (
                          <p className="text-sm text-gray-800 whitespace-pre-wrap">
                            {message.content}
                          </p>
                        )}
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {message.attachments.map((attachment, index) => (
                              <img
                                key={index}
                                src={attachment}
                                alt={`Attachment ${index + 1}`}
                                className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
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
                  />
                </div>
                <Button 
                  onClick={sendMessage} 
                  disabled={!newMessage.trim() && messageImages.length === 0}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
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
