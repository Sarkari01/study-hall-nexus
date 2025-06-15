
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2, Copy, Loader2, RefreshCw } from 'lucide-react';
import { DeepSeekService } from '@/services/deepseekService';
import { useToast } from '@/hooks/use-toast';

interface SmartTextAssistantProps {
  apiKey?: string;
  initialText?: string;
  textType?: 'description' | 'post' | 'message';
  onTextImproved?: (improvedText: string) => void;
}

const SmartTextAssistant: React.FC<SmartTextAssistantProps> = ({ 
  apiKey, 
  initialText = '', 
  textType = 'description',
  onTextImproved 
}) => {
  const [originalText, setOriginalText] = useState(initialText);
  const [improvedText, setImprovedText] = useState('');
  const [selectedType, setSelectedType] = useState<'description' | 'post' | 'message'>(textType);
  const [isImproving, setIsImproving] = useState(false);
  const { toast } = useToast();

  const improveText = async () => {
    if (!originalText.trim()) return;

    if (!apiKey) {
      toast({
        title: "Configuration Error",
        description: "DeepSeek API key not configured.",
        variant: "destructive"
      });
      return;
    }

    setIsImproving(true);
    try {
      const deepSeekService = new DeepSeekService(apiKey);
      const improved = await deepSeekService.improveText(originalText, selectedType);
      
      setImprovedText(improved);
      onTextImproved?.(improved);

      toast({
        title: "Text Improved",
        description: "Your text has been enhanced with AI assistance",
      });
    } catch (error) {
      console.error('Text improvement error:', error);
      toast({
        title: "Error",
        description: "Failed to improve text. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsImproving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard",
    });
  };

  const useImprovedText = () => {
    setOriginalText(improvedText);
    setImprovedText('');
    toast({
      title: "Text Updated",
      description: "Improved text is now your working text",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-purple-600" />
          Smart Text Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Select value={selectedType} onValueChange={(value: 'description' | 'post' | 'message') => setSelectedType(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="description">Description</SelectItem>
              <SelectItem value="post">Community Post</SelectItem>
              <SelectItem value="message">Message</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="capitalize">{selectedType}</Badge>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Original Text
          </label>
          <Textarea
            placeholder={`Enter your ${selectedType} text here...`}
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            rows={4}
          />
        </div>

        <Button 
          onClick={improveText} 
          disabled={!originalText.trim() || isImproving}
          className="w-full"
        >
          {isImproving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Improving Text...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Improve with AI
            </>
          )}
        </Button>

        {improvedText && (
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 block">
              AI Improved Version
            </label>
            <div className="relative">
              <Textarea
                value={improvedText}
                readOnly
                rows={4}
                className="bg-green-50 border-green-200"
              />
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(improvedText)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={useImprovedText} className="flex-1">
                <RefreshCw className="h-4 w-4 mr-2" />
                Use Improved Text
              </Button>
              <Button 
                variant="outline" 
                onClick={() => copyToClipboard(improvedText)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>
        )}

        {!apiKey && (
          <div className="text-center text-sm text-gray-500 p-2 bg-yellow-50 rounded">
            DeepSeek API key not configured. Please configure it in Developer Management.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartTextAssistant;
