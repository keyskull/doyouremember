import { deepseek } from "@ai-sdk/deepseek";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { ModelConfig } from "@/lib/models";
import { google } from "@ai-sdk/google";




export function getProvider(selectedModel: ModelConfig) {
    // Handle different providers
    if (selectedModel.provider === 'openai') {
        return openai(selectedModel.id);        
    } else if (selectedModel.provider === 'deepseek') {
        return deepseek(selectedModel.id);
    } else if (selectedModel.provider === 'anthropic') {
        return anthropic(selectedModel.id);
    } else if (selectedModel.provider === 'google') {
        return google(selectedModel.id);
    } else {
        throw new Error('Unsupported model provider');
    }
}


