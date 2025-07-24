import { VectorService } from '../../services/vector-service';
import { Document } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export class DocumentTools {
  private vectorService = new VectorService();

  async addTextDocument(name: string, content: string) {
    try {
      const document: Document = {
        id: uuidv4(),
        name,
        content,
        source: 'upload',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await this.vectorService.indexDocument(document);

      return {
        success: true,
        message: `Document "${name}" added and indexed successfully`,
        documentId: document.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async searchDocuments(query: string, limit = 5) {
    try {
      const results = await this.vectorService.searchSimilar(query, limit);
      
      return {
        success: true,
        results: results.map(result => ({
          documentName: result.document.name,
          content: result.chunk.content,
          score: result.score,
        })),
        totalResults: results.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}