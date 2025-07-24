import { Router } from 'express';
import { AIService } from '../../services/ai-service';
import { VectorService } from '../../services/vector-service';
import { Document } from '../../types';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const aiService = new AIService();
const vectorService = new VectorService();

// Add document endpoint
router.post('/documents', async (req, res) => {
  try {
    const { name, content } = req.body;

    if (!name || !content) {
      return res.status(400).json({
        success: false,
        error: 'Name and content are required',
      });
    }

    const document: Document = {
      id: uuidv4(),
      name,
      content,
      source: 'upload',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await vectorService.indexDocument(document);

    res.json({
      success: true,
      message: 'Document added successfully',
      document: {
        id: document.id,
        name: document.name,
        source: document.source,
      },
    });
  } catch (error) {
    console.error('Error adding document:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Chat endpoint
router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: 'Question is required',
      });
    }

    const response = await aiService.answerQuestion(question);

    res.json({
      success: true,
      answer: response.answer,
      confidence: response.confidence,
      sources: response.sources.map(source => ({
        documentName: source.document.name,
        content: source.chunk.content.substring(0, 200) + '...',
        score: source.score,
      })),
    });
  } catch (error) {
    console.error('Error answering question:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

export default router;