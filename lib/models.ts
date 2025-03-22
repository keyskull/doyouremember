export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
  temperature?: number;
  provider: 'openai' | 'deepseek' | 'anthropic' | 'google';
  disabled?: boolean;
}

export const availableModels: ModelConfig[] = [
  {
    id: 'gemini-2.0-pro-exp-02-05',
    name: 'Gemini 2.0 Pro Experimental ',
    description: 'Google\'s advanced language model for general tasks',
    maxTokens: 8192,
    temperature: 0.7,
    provider: 'google',
  },
  {
    id: 'gemini-2.0-flash-thinking-exp-01-21',
    name: 'Gemini 2.0 Flash Thinking Experimental 01-21',
    description: 'Google\'s multimodal model for text and image tasks',
    maxTokens: 8192,
    temperature: 0.7,
    provider: 'google',
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Most capable model, best for complex tasks',
    maxTokens: 8192,
    temperature: 0.7,
    provider: 'openai',
    disabled: true,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and efficient for most tasks',
    maxTokens: 4096,
    temperature: 0.7,
    provider: 'openai',
    disabled: true,
  },
  // {
  //   id: 'gpt-3.5-turbo-16k',
  //   name: 'GPT-3.5 Turbo 16K',
  //   description: 'Extended context window for longer conversations',
  //   maxTokens: 16384,
  //   temperature: 0.7,
  //   provider: 'openai',
  //   disabled: true,
  // },
  // {
  //   id: 'claude-3-opus-20240229',
  //   name: 'Claude 3 Opus',
  //   description: 'Most capable Anthropic model, best for complex analysis and tasks',
  //   maxTokens: 16384,
  //   temperature: 0.7,
  //   provider: 'anthropic',
  //   disabled: true,
  // },
  // {
  //   id: 'claude-3-sonnet-20240229',
  //   name: 'Claude 3 Sonnet',
  //   description: 'Balanced Anthropic model for most tasks',
  //   maxTokens: 8192,
  //   temperature: 0.7,
  //   provider: 'anthropic',
  //   disabled: true,
  // },
  // {
  //   id: 'claude-3-haiku-20240307',
  //   name: 'Claude 3 Haiku',
  //   description: 'Fast and efficient Anthropic model',
  //   maxTokens: 4096,
  //   temperature: 0.7,
  //   provider: 'anthropic',
  //   disabled: true,
  // },
  // {
  //   id: 'deepseek-chat',
  //   name: 'DeepSeek Chat',
  //   description: 'General-purpose chat model with strong reasoning capabilities',
  //   maxTokens: 4096,
  //   temperature: 0.7,
  //   provider: 'deepseek',
  //   disabled: true,
  // },
  // {
  //   id: 'deepseek-coder',
  //   name: 'DeepSeek Coder',
  //   description: 'Specialized in code generation and technical tasks',
  //   maxTokens: 8192,
  //   temperature: 0.7,
  //   provider: 'deepseek',
  //   disabled: true,
  // },

]; 