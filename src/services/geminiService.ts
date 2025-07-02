import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

interface GeminiConfig {
  temperature: number;
  topK: number;
  topP: number;
  maxOutputTokens: number;
}

interface GeminiResponse {
  success: boolean;
  data?: any;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;
  private isInitialized = false;
  private rateLimitDelay = 1000; // 1 second base delay
  private maxRetries = 3;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        console.error('Gemini API key not found in environment variables');
        return;
      }

      if (apiKey === 'your_gemini_api_key_here') {
        console.warn('Please replace the placeholder API key with your actual Gemini API key');
        return;
      }

      this.genAI = new GoogleGenerativeAI(apiKey);
      
      // Configure the model with safety settings and generation config
      this.model = this.genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
          responseMimeType: 'application/json',
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      });

      this.isInitialized = true;
      console.log('Gemini API initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemini API:', error);
      this.isInitialized = false;
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async makeRequestWithRetry(
    prompt: string, 
    config?: Partial<GeminiConfig>,
    retryCount = 0
  ): Promise<GeminiResponse> {
    try {
      if (!this.isInitialized || !this.model) {
        return {
          success: false,
          error: 'Gemini API not properly initialized'
        };
      }

      // Apply custom configuration if provided
      if (config) {
        const updatedConfig = {
          temperature: config.temperature ?? 0.8,
          topK: config.topK ?? 40,
          topP: config.topP ?? 0.95,
          maxOutputTokens: config.maxOutputTokens ?? 2048,
          responseMimeType: 'application/json',
        };

        this.model = this.genAI!.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: updatedConfig,
        });
      }

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      
      if (!response) {
        throw new Error('No response received from Gemini API');
      }

      const text = response.text();
      
      // Try to parse as JSON
      let parsedData;
      try {
        parsedData = JSON.parse(text);
      } catch (parseError) {
        // If JSON parsing fails, return the raw text
        parsedData = { content: text };
      }

      // Extract usage information if available
      const usage = response.usageMetadata ? {
        promptTokens: response.usageMetadata.promptTokenCount || 0,
        completionTokens: response.usageMetadata.candidatesTokenCount || 0,
        totalTokens: response.usageMetadata.totalTokenCount || 0,
      } : undefined;

      return {
        success: true,
        data: parsedData,
        usage
      };

    } catch (error: any) {
      console.error(`Gemini API request failed (attempt ${retryCount + 1}):`, error);

      // Handle rate limiting
      if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        if (retryCount < this.maxRetries) {
          const delayTime = this.rateLimitDelay * Math.pow(2, retryCount); // Exponential backoff
          console.log(`Rate limited. Retrying in ${delayTime}ms...`);
          await this.delay(delayTime);
          return this.makeRequestWithRetry(prompt, config, retryCount + 1);
        }
        return {
          success: false,
          error: 'Rate limit exceeded. Please try again later.'
        };
      }

      // Handle quota exceeded
      if (error.message?.includes('quota') || error.message?.includes('QUOTA_EXCEEDED')) {
        return {
          success: false,
          error: 'API quota exceeded. Please check your billing settings.'
        };
      }

      // Handle safety filter blocks
      if (error.message?.includes('SAFETY')) {
        return {
          success: false,
          error: 'Content was blocked by safety filters. Please modify your request.'
        };
      }

      // Generic retry for other errors
      if (retryCount < this.maxRetries) {
        await this.delay(this.rateLimitDelay);
        return this.makeRequestWithRetry(prompt, config, retryCount + 1);
      }

      return {
        success: false,
        error: error.message || 'Unknown error occurred'
      };
    }
  }

  async testConnection(): Promise<GeminiResponse> {
    const testPrompt = `
      Please respond with a simple JSON object containing:
      {
        "status": "connected",
        "message": "Gemini API is working correctly",
        "timestamp": "${new Date().toISOString()}"
      }
    `;

    console.log('Testing Gemini API connection...');
    const result = await this.makeRequestWithRetry(testPrompt);
    
    if (result.success) {
      console.log('✅ Gemini API connection test successful:', result.data);
    } else {
      console.error('❌ Gemini API connection test failed:', result.error);
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
  ): Promise<GeminiResponse> {
    const prompt = `
      Generate a beautiful wedding story for a couple's website based on the following information:
      
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
      }
    `;

    return this.makeRequestWithRetry(prompt, {
      temperature: 0.9,
      maxOutputTokens: 1024
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
  ): Promise<GeminiResponse> {
    const prompt = `
      Generate vision board content for a wedding based on these preferences:
      
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
      }
    `;

    return this.makeRequestWithRetry(prompt, {
      temperature: 0.8,
      maxOutputTokens: 1536
    });
  }

  async analyzeWeddingImage(imageDescription: string): Promise<GeminiResponse> {
    const prompt = `
      Analyze this wedding-related image and provide detailed insights:
      
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
      }
    `;

    return this.makeRequestWithRetry(prompt, {
      temperature: 0.7,
      maxOutputTokens: 2048
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
  ): Promise<GeminiResponse> {
    const prompt = `
      You are a helpful AI wedding planning assistant. Respond to this user message with helpful, personalized advice:
      
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
      
      Keep responses conversational, helpful, and specific to wedding planning.
    `;

    return this.makeRequestWithRetry(prompt, {
      temperature: 0.8,
      maxOutputTokens: 1024
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
      hasApiKey: !!import.meta.env.VITE_GEMINI_API_KEY,
      rateLimitDelay: this.rateLimitDelay,
      maxRetries: this.maxRetries
    };
  }
}

// Export a singleton instance
export const geminiService = new GeminiService();
export default geminiService;