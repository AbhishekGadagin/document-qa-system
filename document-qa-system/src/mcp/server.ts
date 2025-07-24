import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { DocumentTools } from './tools/document-tools';

class MCPServer {
  private server = new Server(
    {
      name: 'document-qa-server',
      version: '1.0.0',
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  private documentTools = new DocumentTools();

  constructor() {
    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'add_document',
            description: 'Add a text document to the knowledge base',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name of the document',
                },
                content: {
                  type: 'string',
                  description: 'Content of the document',
                },
              },
              required: ['name', 'content'],
            },
          },
          {
            name: 'search_documents',
            description: 'Search for relevant documents',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query',
                },
                limit: {
                  type: 'number',
                  description: 'Maximum results',
                  default: 5,
                },
              },
              required: ['query'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (!args || typeof args !== 'object') {
        throw new Error(`Invalid or missing arguments for tool: ${name}`);
      }

      const argObj = args as Record<string, unknown>;
      let result;

      switch (name) {
        case 'add_document':
          if (typeof argObj.name !== 'string' || typeof argObj.content !== 'string') {
            throw new Error(`'name' and 'content' must be strings for add_document`);
          }
          result = await this.documentTools.addTextDocument(argObj.name, argObj.content);
          break;

        case 'search_documents':
          if (typeof argObj.query !== 'string') {
            throw new Error(`'query' must be a string for search_documents`);
          }
          result = await this.documentTools.searchDocuments(
            argObj.query,
            typeof argObj.limit === 'number' ? argObj.limit : 5
          );
          break;

        default:
          throw new Error(`Unknown tool: ${name}`);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    });
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('✅ MCP Server started');
  }
}

export { MCPServer };
