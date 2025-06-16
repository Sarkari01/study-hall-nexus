
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Loader2, AlertCircle, Settings } from 'lucide-react';
import { DeepSeekService, DeepSeekMessage } from '@/services/deepseekService';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  error?: boolean;
}

interface AIChatbotProps {
  apiKey?: string;
  userType: 'student' | 'merchant' | 'admin';
  className?: string;
}

const AIChatbot: React.FC<AIChatbotProps> = ({ apiKey, userType, className }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant. I can help you with bookings, study hall information, merchant support, and answer any questions about our platform. How can I assist you today?',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deepSeekService, setDeepSeekService] = useState<DeepSeekService | null>(null);
  const [apiKeyError, setApiKeyError] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (apiKey && apiKey.trim() !== '') {
      setDeepSeekService(new DeepSeekService(apiKey));
      setApiKeyError('');
    } else {
      setDeepSeekService(null);
      setApiKeyError('DeepSeek API key not configured');
    }
  }, [apiKey]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getSystemPrompt = (): string => {
    const basePrompt = `You are a helpful AI assistant for a study hall booking platform called Sarkari Ninja. You can help with:
    - Booking study halls
    - Finding available halls
    - Pricing information
    - Platform features
    - Account support
    - General questions about study spaces
    
    Keep responses helpful, concise, and friendly. If you cannot help with something, suggest escalating to human support.`;

    switch (userType) {
      case 'student':
        return `${basePrompt} You are specifically helping a student user.`;
      case 'merchant':
        return `${basePrompt} You are specifically helping a merchant/hall owner with their business operations.`;
      case 'admin':
        return `${basePrompt} You are helping an admin user with platform management.`;
      default:
        return basePrompt;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    if (!deepSeekService) {
      toast({
        title: "Configuration Error",
        description: "DeepSeek API key not configured. Please set it in Developer Management settings.",
        variant: "destructive"
      });
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const conversationMessages: DeepSeekMessage[] = [
        { role: 'system', content: getSystemPrompt() },
        ...messages.slice(-10).map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        })),
        { role: 'user', content: inputMessage }
      ];

      const response = await deepSeekService.chat(conversationMessages);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Chat error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: `I apologize, but I encountered an error: ${errorMessage}`,
        role: 'assistant',
        timestamp: new Date(),
        error: true
      };

      setMessages(prev => [...prev, errorResponse]);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openDeveloperSettings = () => {
    // Navigate to developer management
    window.location.href = '/admin?tab=developer-management';
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          AI Assistant
          <Badge variant="outline" className="ml-auto">
            {userType}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* API Key Status */}
        {apiKeyError && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800 flex-1">{apiKeyError}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={openDeveloperSettings}
              className="flex items-center gap-1"
            >
              <Settings className="h-3 w-3" />
              Configure
            </Button>
          </div>
        )}

        {/* Messages */}
        <div className="h-96 overflow-y-auto space-y-3 p-3 bg-gray-50 rounded-lg">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-2 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={`${message.error ? 'bg-red-100' : 'bg-blue-100'}`}>
                    {message.error ? (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    ) : (
                      <Bot className="h-4 w-4 text-blue-600" />
                    )}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.error
                    ? 'bg-red-50 border border-red-200'
                    : 'bg-white border'
                }`}
              >
                <p className={`text-sm whitespace-pre-wrap ${
                  message.error ? 'text-red-800' : ''
                }`}>
                  {message.content}
                </p>
                <p className={`text-xs mt-1 ${
                  message.role === 'user' 
                    ? 'text-blue-100' 
                    : message.error 
                    ? 'text-red-500' 
                    : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
              
              {message.role === 'user' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gray-100">
                    <User className="h-4 w-4 text-gray-600" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-100">
                  <Bot className="h-4 w-4 text-blue-600" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white border p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-500">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            placeholder={apiKeyError ? "Please configure API key first..." : "Ask me anything about study halls..."}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading || !!apiKeyError}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputMessage.trim() || isLoading || !!apiKeyError}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChatbot;
