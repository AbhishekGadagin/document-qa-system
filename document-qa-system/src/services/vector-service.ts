import { qdrantClient, COLLECTION_NAME } from '../config/database';
import { EmbeddingService } from './embedding-service';
import { TextSplitter } from '../utils/text-splitter';
import { Document, DocumentChunk, SearchResult } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class VectorService {
  private embeddingService = new EmbeddingService();
  private textSplitter = new TextSplitter();

  async indexDocument(document: Document): Promise<void> {
    try {
      console.log(`Indexing document: ${document.name}`);
      
      // Split document into chunks
      const chunks = this.textSplitter.splitText(document.content);
      console.log(`Split into ${chunks.length} chunks`);
      
      // Generate embeddings for chunks
      const embeddings = await this.embeddingService.generateEmbeddings(chunks);
      
      // Create document chunks
      const documentChunks: DocumentChunk[] = chunks.map((content, index) => ({
        id: uuidv4(),
        documentId: document.id,
        content,
        embedding: embeddings[index],
        metadata: {
          chunkIndex: index,
          startChar: index * 800,
          endChar: (index + 1) * 800,
        },
      }));

      // Store in Qdrant
      await this.storeChunks(documentChunks, document);
      
      console.log(`Successfully indexed: ${document.name}`);
    } catch (error) {
      console.error(`Error indexing document ${document.name}:`, error);
      throw error;
    }
  }

  private async storeChunks(chunks: DocumentChunk[], document: Document): Promise<void> {
    const points = chunks.map(chunk => ({
      id: chunk.id,
      vector: chunk.embedding,
      payload: {
        documentId: chunk.documentId,
        documentName: document.name,
        content: chunk.content,
        chunkIndex: chunk.metadata.chunkIndex,
        source: document.source,
        sourceId: document.sourceId,
      },
    }));

    await qdrantClient.upsert(COLLECTION_NAME, {
      wait: true,
      points,
    });
  }

  async searchSimilar(query: string, limit = 5): Promise<SearchResult[]> {
    try {
      // Generate embedding for query
      const queryEmbedding = await this.embeddingService.generateEmbedding(query);

      // Search in Qdrant
      const searchResult = await qdrantClient.search(COLLECTION_NAME, {
        vector: queryEmbedding,
        limit,
        with_payload: true,
        score_threshold: 0.6,
      });

      // Convert to SearchResult format
      const results: SearchResult[] = searchResult.map(result => ({
        chunk: {
          id: result.id as string,
          documentId: result.payload?.documentId as string,
          content: result.payload?.content as string,
          embedding: [],
          metadata: {
            chunkIndex: result.payload?.chunkIndex as number,
            startChar: 0,
            endChar: 0,
          },
        },
        score: result.score,
        document: {
          id: result.payload?.documentId as string,
          name: result.payload?.documentName as string,
          content: '',
          source: result.payload?.source as 'google-drive' | 'upload',
          sourceId: result.payload?.sourceId as string,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      }));

      return results;
    } catch (error) {
      console.error('Error searching similar content:', error);
      throw error;
    }
  }
}