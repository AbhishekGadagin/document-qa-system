import { openai } from '@ai-sdk/openai';
import { config } from 'dotenv';

config();

export function getAIModel() {
  return openai('gpt-3.5-turbo');
}

export function getEmbeddingModel() {
  return openai.embedding('text-embedding-3-small');
}