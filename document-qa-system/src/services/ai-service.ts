import { generateText } from 'ai';
import { getAIModel } from '../config/ai';
import { VectorService } from './vector-service';
import { QAResponse } from '../types';

export class AIService {
  private model = getAIModel();
  private vectorService = new VectorService();

  async answerQuestion(question: string): Promise<QAResponse> {
    try {
      console.log(`Answering question: ${question}`);
      
      // Search for relevant context
      const searchResults = await this.vectorService.searchSimilar(question, 3);
      
      if (searchResults.length === 0) {
        return {
          answer: "I couldn't find any relevant information in the documents to answer your question.",
          sources: [],
          confidence: 0,
        };
      }

      // Prepare context from search results
      const context = searchResults
        .map((result, index) => 
          `Source ${index + 1} (from ${result.document.name}):\n${result.chunk.content}`
        )
        .join('\n\n---\n\n');

      // Generate answer using AI
      const prompt = `Based on the following context from documents, please answer the question. If the context doesn't contain enough information, say so clearly.

Context:
${context}

Question: ${question}

Please provide a helpful answer based only on the information provided in the context above. If you reference specific information, mention which source it came from.

Answer:`;

      const { text } = await generateText({
        model: this.model,
        prompt,
        temperature: 0.3,
        maxTokens: 500,
      });

      // Calculate confidence based on search scores
      const avgScore = searchResults.reduce((sum, result) => sum + result.score, 0) / searchResults.length;
      const confidence = Math.min(avgScore * 100, 95);

      return {
        answer: text,
        sources: searchResults,
        confidence,
      };
    } catch (error) {
      console.error('Error generating answer:', error);
      throw error;
    }
  }
}