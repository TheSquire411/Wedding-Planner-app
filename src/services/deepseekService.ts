interface DeepseekConfig {
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
}

interface DeepseekResponse {
  success: boolean;
  data?: any;
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface DeepseekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

class DeepseekService {
  private apiKey: string | null = null;
  private baseURL = 'https://api.deepseek.com/v1';
  private isInitialized = false;
  private rateLimitDelay = 1000; // 1 second base delay
  private maxRetries = 3;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    try {
      const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
      
      if (!apiKey) {
        console.error('Deepseek API key not found in environment variables');
        return;
      }

      if (apiKey === 'your_deepseek_api_key_here') {
        console.warn('Please replace the placeholder API key with your actual Deepseek API key');
        return;
      }

      this.apiKey = apiKey;
      this.isInitialized = true;
      console.log('Deepseek API initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Deepseek API:', error);
      this.isInitialized = false;
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequestWithRetry(
    messages: DeepseekMessage[],
    config?: Partial<DeepseekConfig>,
    retryCount = 0
  ): Promise<DeepseekResponse> {
    try {
      if (!this.isInitialized || !this.apiKey) {
        return {
          success: false,
          error: 'Deepseek API not properly initialized'
        };
      }

      const requestConfig: DeepseekConfig = {
        temperature: config?.temperature ?? 0.8,
        max_tokens: config?.max_tokens ?? 2048,
        top_p: config?.top_p ?? 0.95,
        frequency_penalty: config?.frequency_penalty ?? 0,
        presence_penalty: config?.presence_penalty ?? 0,
      };

      const requestBody = {
        model: 'deepseek-chat',
        messages,
        ...requestConfig,
        stream: false
      };

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0]) {
        throw new Error('Invalid response format from Deepseek API');
      }

      const content = data.choices[0].message?.content;
      if (!content) {
        throw new Error('No content received from Deepseek API');
      }

      // Try to parse as JSON, fallback to raw text
      let parsedData;
      try {
        parsedData = JSON.parse(content);
      } catch (parseError) {
        parsedData = { content };
      }

      // Extract usage information
      const usage = data.usage ? {
        prompt_tokens: data.usage.prompt_tokens || 0,
        completion_tokens: data.usage.completion_tokens || 0,
        total_tokens: data.usage.total_tokens || 0,
      } : undefined;

      return {
        success: true,
        data: parsedData,
        usage
      };

    } catch (error: any) {
      console.error(`Deepseek API request failed (attempt ${retryCount + 1}):`, error);

      // Handle rate limiting
      if (error.message?.includes('429') || error.message?.includes('rate_limit')) {
        if (retryCount < this.maxRetries) {
          const delayTime = this.rateLimitDelay * Math.pow(2, retryCount);
          console.log(`Rate limited. Retrying in ${delayTime}ms...`);
          await this.delay(delayTime);
          return this.makeRequestWithRetry(messages, config, retryCount + 1);
        }
        return {
          success: false,
          error: 'Rate limit exceeded. Please try again later.'
        };
      }

      // Handle quota exceeded
      if (error.message?.includes('quota') || error.message?.includes('insufficient_quota')) {
        return {
          success: false,
          error: 'API quota exceeded. Please check your billing settings.'
        };
      }

      // Handle authentication errors
      if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
        return {
          success: false,
          error: 'Invalid API key. Please check your Deepseek API key.'
        };
      }

      // Generic retry for other errors
      if (retryCount < this.maxRetries) {
        await this.delay(this.rateLimitDelay);
        return this.makeRequestWithRetry(messages, config, retryCount + 1);
      }

      return {
        success: false,
        error: error.message || 'Unknown error occurred'
      };
    }
  }

  async testConnection(): Promise<DeepseekResponse> {
    const messages: DeepseekMessage[] = [
      {
        role: 'system',
        content: 'You are a helpful assistant. Respond only with valid JSON.'
      },
      {
        role: 'user',
        content: `Please respond with a simple JSON object containing:
        {
          "status": "connected",
          "message": "Deepseek API is working correctly",
          "timestamp": "${new Date().toISOString()}"
        }`
      }
    ];

    console.log('Testing Deepseek API connection...');
    const result = await this.makeRequestWithRetry(messages);
    
    if (result.success) {
      console.log('✅ Deepseek API connection test successful:', result.data);
    } else {
      console.error('❌ Deepseek API connection test failed:', result.error);
    }

    return result;
  }

  async generateWeddingStory(
    coupleInfo: {
      names: string;
      style: 'romantic' | 'casual' | 'formal';
      weddingDate?: string;
      venue?: string;
      additionalInfo?: string;
    }
  ): Promise<DeepseekResponse> {
    const messages: DeepseekMessage[] = [
      {
        role: 'system',
        content: 'You are a professional wedding story writer. Create beautiful, personalized wedding stories based on the provided information. Always respond with valid JSON.'
      },
      {
        role: 'user',
        content: `Generate a beautiful wedding story for a couple's website based on the following information:
        
        Couple Names: ${coupleInfo.names}
        Writing Style: ${coupleInfo.style}
        Wedding Date: ${coupleInfo.weddingDate || 'Not specified'}
        Venue: ${coupleInfo.venue || 'Not specified'}
        Additional Info: ${coupleInfo.additionalInfo || 'None'}
        
        Please create a ${coupleInfo.style} wedding story that is approximately 150-200 words long.
        
        Return the response in this JSON format:
        {
          "story": "The complete wedding story text",
          "style": "${coupleInfo.style}",
          "wordCount": number,
          "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
        }`
      }
    ];

    return this.makeRequestWithRetry(messages, {
      temperature: 0.9,
      max_tokens: 1024
    });
  }

  async generateVisionBoardContent(
    preferences: {
      aesthetic: string;
      venue: string;
      colors: string[];
      season: string;
      mustHave?: string;
      avoid?: string;
    }
  ): Promise<DeepseekResponse> {
    const messages: DeepseekMessage[] = [
      {
        role: 'system',
        content: 'You are a professional wedding designer and stylist. Create detailed vision board recommendations based on wedding preferences. Always respond with valid JSON.'
      },
      {
        role: 'user',
        content: `Generate vision board content for a wedding based on these preferences:
        
        Aesthetic: ${preferences.aesthetic}
        Venue Type: ${preferences.venue}
        Color Palette: ${preferences.colors.join(', ')}
        Season: ${preferences.season}
        Must-Have Elements: ${preferences.mustHave || 'None specified'}
        Elements to Avoid: ${preferences.avoid || 'None specified'}
        
        Please provide detailed recommendations in this JSON format:
        {
          "moodDescription": "A detailed description of the overall mood and aesthetic",
          "colorPalette": ["#hex1", "#hex2", "#hex3", "#hex4", "#hex5"],
          "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
          "decorElements": ["element1", "element2", "element3", "element4", "element5"],
          "flowerSuggestions": ["flower1", "flower2", "flower3"],
          "venueFeatures": ["feature1", "feature2", "feature3"],
          "lightingIdeas": ["idea1", "idea2", "idea3"],
          "textileTextures": ["texture1", "texture2", "texture3"]
        }`
      }
    ];

    return this.makeRequestWithRetry(messages, {
      temperature: 0.8,
      max_tokens: 1536
    });
  }

  async analyzeWeddingImage(imageDescription: string): Promise<DeepseekResponse> {
    const messages: DeepseekMessage[] = [
      {
        role: 'system',
        content: 'You are a professional wedding stylist and image analyst. Analyze wedding-related images and provide detailed insights. Always respond with valid JSON.'
      },
      {
        role: 'user',
        content: `Analyze this wedding-related image and provide detailed insights:
        
        Image Description: ${imageDescription}
        
        Please provide a comprehensive analysis in this JSON format:
        {
          "overallStyle": {
            "aesthetic": "Main style category",
            "keywords": ["keyword1", "keyword2", "keyword3"],
            "mood": "Description of the mood/feeling",
            "colorScheme": ["color1", "color2", "color3"]
          },
          "weddingDress": {
            "silhouette": "Dress silhouette type",
            "neckline": "Neckline style",
            "fabric": "Fabric type and texture",
            "embellishments": ["detail1", "detail2"],
            "styleCategory": "Style category"
          },
          "florals": {
            "mainFlowers": ["flower1", "flower2"],
            "colorPalette": ["color1", "color2"],
            "arrangementStyle": "Style description",
            "season": "Seasonal indicators"
          },
          "venue": {
            "settingType": "Venue type",
            "keyFeatures": ["feature1", "feature2"],
            "lighting": "Lighting description",
            "searchTerms": ["term1", "term2", "term3"]
          }
        }`
      }
    ];

    return this.makeRequestWithRetry(messages, {
      temperature: 0.7,
      max_tokens: 2048
    });
  }

  async generateChatResponse(
    message: string,
    userContext: {
      name?: string;
      weddingDate?: string;
      styleProfile?: any;
      recentActivity?: string;
    }
  ): Promise<DeepseekResponse> {
    const messages: DeepseekMessage[] = [
      {
        role: 'system',
        content: 'You are a helpful AI wedding planning assistant. Provide personalized, friendly advice for wedding planning questions. Always respond with valid JSON.'
      },
      {
        role: 'user',
        content: `You are a helpful AI wedding planning assistant. Respond to this user message with helpful, personalized advice:
        
        User Message: "${message}"
        
        User Context:
        - Name: ${userContext.name || 'Not provided'}
        - Wedding Date: ${userContext.weddingDate || 'Not provided'}
        - Style Profile: ${JSON.stringify(userContext.styleProfile) || 'Not provided'}
        - Recent Activity: ${userContext.recentActivity || 'Not provided'}
        
        Please provide a helpful, friendly response in this JSON format:
        {
          "response": "Your helpful response to the user",
          "suggestions": ["actionable suggestion 1", "actionable suggestion 2"],
          "relatedTopics": ["topic1", "topic2", "topic3"],
          "confidence": 0.95
        }
        
        Keep responses conversational, helpful, and specific to wedding planning.`
      }
    ];

    return this.makeRequestWithRetry(messages, {
      temperature: 0.8,
      max_tokens: 1024
    });
  }

  // Utility method to check if the service is ready
  isReady(): boolean {
    return this.isInitialized;
  }

  // Method to get current configuration
  getConfig(): any {
    return {
      isInitialized: this.isInitialized,
      hasApiKey: !!import.meta.env.VITE_DEEPSEEK_API_KEY,
      baseURL: this.baseURL,
      rateLimitDelay: this.rateLimitDelay,
      maxRetries: this.maxRetries
    };
  }
}

// Export a singleton instance
export const deepseekService = new DeepseekService();
export default deepseekService;