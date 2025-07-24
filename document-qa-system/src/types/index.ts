export interface Document {
  id: string;
  name: string;
  content: string;
  source: 'google-drive' | 'upload';
  sourceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  embedding: number[];
  metadata: {
    chunkIndex: number;
    startChar: number;
    endChar: number;
  };
}

export interface SearchResult {
  chunk: DocumentChunk;
  score: number;
  document: Document;
}

export interface QAResponse {
  answer: string;
  sources: SearchResult[];
  confidence: number;
}