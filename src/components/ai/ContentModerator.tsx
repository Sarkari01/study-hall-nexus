
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { DeepSeekService } from '@/services/deepseekService';
import { useToast } from '@/hooks/use-toast';

interface ContentModerationResult {
  flagged: boolean;
  reason?: string;
  confidence?: number;
}

interface ContentModeratorProps {
  apiKey?: string;
  onModerationResult?: (result: ContentModerationResult) => void;
}

const ContentModerator: React.FC<ContentModeratorProps> = ({ apiKey, onModerationResult }) => {
  const [content, setContent] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<ContentModerationResult | null>(null);
  const { toast } = useToast();

  const moderateContent = async () => {
    if (!content.trim()) return;

    if (!apiKey) {
      toast({
        title: "Configuration Error",
        description: "DeepSeek API key not configured.",
        variant: "destructive"
      });
      return;
    }

    setIsChecking(true);
    try {
      const deepSeekService = new DeepSeekService(apiKey);
      const moderationResult = await deepSeekService.moderateContent(content);
      
      setResult(moderationResult);
      onModerationResult?.(moderationResult);

      if (moderationResult.flagged) {
        toast({
          title: "Content Flagged",
          description: moderationResult.reason || "Content violates community guidelines",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Content Approved",
          description: "Content passed moderation checks",
        });
      }
    } catch (error) {
      console.error('Content moderation error:', error);
      toast({
        title: "Error",
        description: "Failed to moderate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          AI Content Moderation
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <Textarea
            placeholder="Enter content to check for inappropriate material, spam, or harassment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />
        </div>

        <Button 
          onClick={moderateContent} 
          disabled={!content.trim() || isChecking}
          className="w-full"
        >
          {isChecking ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Checking Content...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Check Content
            </>
          )}
        </Button>

        {result && (
          <Alert className={result.flagged ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
            <div className="flex items-center gap-2">
              {result.flagged ? (
                <AlertTriangle className="h-4 w-4 text-red-600" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
              <div className="flex-1">
                <AlertDescription>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                      {result.flagged ? 'Content Flagged' : 'Content Approved'}
                    </span>
                    <Badge variant={result.flagged ? "destructive" : "default"}>
                      {result.flagged ? 'Rejected' : 'Approved'}
                    </Badge>
                  </div>
                  {result.reason && (
                    <p className="text-sm">{result.reason}</p>
                  )}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        {!apiKey && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              DeepSeek API key not configured. Please configure it in Developer Management to use content moderation.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentModerator;
