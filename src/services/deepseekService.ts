
export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class DeepSeekService {
  private apiKey: string;
  private baseURL = 'https://api.deepseek.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chat(messages: DeepSeekMessage[], temperature: number = 0.7): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages,
          temperature,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.statusText}`);
      }

      const data: DeepSeekResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw error;
    }
  }

  async moderateContent(content: string): Promise<{ flagged: boolean; reason?: string }> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: `You are a content moderation AI. Analyze the following content for:
        - Inappropriate content
        - Spam
        - Harassment
        - Hate speech
        - Violence
        
        Respond with JSON: {"flagged": boolean, "reason": "explanation if flagged"}`
      },
      {
        role: 'user',
        content: content
      }
    ];

    try {
      const response = await this.chat(messages, 0.1);
      return JSON.parse(response);
    } catch (error) {
      console.error('Content moderation error:', error);
      return { flagged: false };
    }
  }

  async improveText(text: string, type: 'description' | 'post' | 'message'): Promise<string> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: `You are a writing assistant. Improve the following ${type} by:
        - Fixing grammar and spelling
        - Making it more engaging
        - Keeping the original meaning
        - Making it appropriate for a study hall platform
        
        Return only the improved text without explanations.`
      },
      {
        role: 'user',
        content: text
      }
    ];

    return await this.chat(messages, 0.3);
  }

  async predictRevenue(historicalData: any[]): Promise<{ prediction: number; confidence: number }> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: `You are a business analytics AI. Analyze the historical revenue data and predict next month's revenue.
        Return JSON: {"prediction": number, "confidence": number (0-1)}`
      },
      {
        role: 'user',
        content: `Historical data: ${JSON.stringify(historicalData)}`
      }
    ];

    try {
      const response = await this.chat(messages, 0.2);
      return JSON.parse(response);
    } catch (error) {
      console.error('Revenue prediction error:', error);
      return { prediction: 0, confidence: 0 };
    }
  }

  async detectFraud(userBehavior: any): Promise<{ suspicious: boolean; riskLevel: number; reasons: string[] }> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: `You are a fraud detection AI. Analyze user behavior for suspicious patterns:
        - Repeated bookings and cancellations
        - Unusual payment behavior
        - Abusive patterns
        
        Return JSON: {"suspicious": boolean, "riskLevel": number (0-10), "reasons": ["reason1", "reason2"]}`
      },
      {
        role: 'user',
        content: `User behavior: ${JSON.stringify(userBehavior)}`
      }
    ];

    try {
      const response = await this.chat(messages, 0.1);
      return JSON.parse(response);
    } catch (error) {
      console.error('Fraud detection error:', error);
      return { suspicious: false, riskLevel: 0, reasons: [] };
    }
  }

  async generateInsights(studentData: any): Promise<{ insights: string[]; recommendations: string[] }> {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: `You are a student behavior analyst. Generate insights and recommendations based on usage patterns.
        Return JSON: {"insights": ["insight1", "insight2"], "recommendations": ["rec1", "rec2"]}`
      },
      {
        role: 'user',
        content: `Student data: ${JSON.stringify(studentData)}`
      }
    ];

    try {
      const response = await this.chat(messages, 0.5);
      return JSON.parse(response);
    } catch (error) {
      console.error('Insights generation error:', error);
      return { insights: [], recommendations: [] };
    }
  }
}
