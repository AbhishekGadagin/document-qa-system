import { embed } from 'ai';
import { getEmbeddingModel } from '../config/ai';

export class EmbeddingService {
  private model = getEmbeddingModel();

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const { embedding } = await embed({
        model: this.model,
        value: text,
      });
      return embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    
    for (const text of texts) {
      const embedding = await this.generateEmbedding(text);
      embeddings.push(embedding);
      // Add small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return embeddings;
  }
}