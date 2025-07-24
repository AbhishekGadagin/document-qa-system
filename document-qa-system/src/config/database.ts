import { QdrantClient } from '@qdrant/js-client-rest';
import { config } from 'dotenv';

config();

export const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL || 'http://localhost:6333',
});

export const COLLECTION_NAME = process.env.QDRANT_COLLECTION || 'documents';

export async function initializeQdrant() {
  try {
    const collections = await qdrantClient.getCollections();
    const exists = collections.collections.some(c => c.name === COLLECTION_NAME);
    
    if (!exists) {
      await qdrantClient.createCollection(COLLECTION_NAME, {
        vectors: {
          size: 1536, // OpenAI embedding size
          distance: 'Cosine',
        },
        optimizers_config: {
          default_segment_number: 2,
        },
        replication_factor: 1,
      });
      console.log(`Created Qdrant collection: ${COLLECTION_NAME}`);
    } else {
      console.log(`Qdrant collection ${COLLECTION_NAME} already exists`);
    }
  } catch (error) {
    console.error('Failed to initialize Qdrant:', error);
    throw error;
  }
}