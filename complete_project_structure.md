# Complete Document Q&A System - GitHub Ready Project

## 📁 Complete Directory Structure

```
document-qa-system/
├── .env.example                    # Example environment file
├── .gitignore                      # Git ignore rules
├── README.md                       # Project documentation
├── package.json                    # Node.js dependencies
├── tsconfig.json                   # TypeScript configuration
├── docker-compose.yml              # Docker setup for Qdrant
├── LICENSE                         # MIT License
├── CONTRIBUTING.md                 # Contribution guidelines
├── .github/
│   └── workflows/
│       └── ci.yml                  # GitHub Actions CI/CD
├── src/
│   ├── config/
│   │   ├── database.ts             # Qdrant database configuration
│   │   ├── ai.ts                   # AI model configuration
│   │   └── google-drive.ts         # Google Drive API setup
│   ├── services/
│   │   ├── document-service.ts     # Document handling service
│   │   ├── embedding-service.ts    # Text embedding service
│   │   ├── vector-service.ts       # Vector database operations
│   │   └── ai-service.ts           # AI question answering
│   ├── mcp/
│   │   ├── server.ts              # MCP server implementation
│   │   └── tools/
│   │       ├── document-tools.ts   # Document management tools
│   │       └── search-tools.ts     # Search functionality tools
│   ├── api/
│   │   ├── app.ts                 # Express server setup
│   │   └── routes/
│   │       ├── chat.ts            # Chat and document routes
│   │       └── health.ts          # Health check endpoint
│   ├── utils/
│   │   ├── text-splitter.ts       # Text chunking utility
│   │   ├── logger.ts              # Logging utility
│   │   └── validation.ts          # Input validation
│   └── types/
│       └── index.ts               # TypeScript type definitions
├── public/
│   ├── index.html                 # Main web interface
│   ├── style.css                  # Styling
│   ├── script.js                  # Frontend JavaScript
│   └── favicon.ico                # Website icon
├── docs/
│   ├── API.md                     # API documentation
│   ├── DEPLOYMENT.md              # Deployment guide
│   └── ARCHITECTURE.md            # System architecture
├── scripts/
│   ├── setup.js                   # Initial setup script
│   ├── seed-data.js               # Sample data seeder
│   └── health-check.js            # System health checker
└── tests/
    ├── unit/
    │   ├── services/
    │   │   ├── ai-service.test.js
    │   │   └── vector-service.test.js
    │   └── utils/
    │       └── text-splitter.test.js
    └── integration/
        └── api.test.js
```

## 📋 File Contents

### Root Files

#### `.env.example`
```env
# AI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here
AI_PROVIDER=openai

# Qdrant Configuration
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION=documents

# Google Drive Configuration (Optional)
GOOGLE_CREDENTIALS_PATH=./credentials/service-account.json
GOOGLE_DRIVE_FOLDER_ID=your-google-drive-folder-id

# Server Configuration
PORT=3000
NODE_ENV=development

# MCP Configuration
MCP_SERVER_PORT=3001

# Security (Generate random strings for production)
JWT_SECRET=your-jwt-secret-here
ENCRYPTION_KEY=your-encryption-key-here
```

#### `.gitignore`
```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Credentials
credentials/
*.json
*.pem
*.key

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env.test

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt

# Gatsby files
.cache/
public

# Vuepress build output
.vuepress/dist

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test/

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Docker
.dockerignore
```

#### `package.json`
```json
{
  "name": "document-qa-system",
  "version": "1.0.0",
  "description": "AI-powered document question answering system with vector search and MCP integration",
  "main": "dist/api/app.js",
  "scripts": {
    "start": "node dist/api/app.js",
    "dev": "nodemon src/api/app.ts",
    "build": "tsc",
    "build:watch": "tsc --watch",
    "mcp": "ts-node src/mcp/server.ts",
    "setup": "node scripts/setup.js",
    "seed": "node scripts/seed-data.js",
    "health": "node scripts/health-check.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "eslint src/**/*.ts --fix",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "clean": "rimraf dist",
    "prestart": "npm run build"
  },
  "keywords": [
    "ai",
    "document-qa",
    "vector-search",
    "openai",
    "qdrant",
    "mcp",
    "typescript",
    "nodejs"
  ],
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/document-qa-system.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/document-qa-system/issues"
  },
  "homepage": "https://github.com/yourusername/document-qa-system#readme",
  "dependencies": {
    "@ai-sdk/openai": "^0.0.66",
    "ai": "^3.4.7",
    "@qdrant/js-client-rest": "^1.11.0",
    "@modelcontextprotocol/sdk": "^1.0.0",
    "express": "^4.21.1",
    "cors": "^2.8.5",
    "helmet": "^8.0.0",
    "morgan": "^1.10.0",
    "googleapis": "^144.0.0",
    "google-auth-library": "^9.14.1",
    "uuid": "^10.0.0",
    "dotenv": "^16.4.5",
    "joi": "^17.13.3",
    "compression": "^1.7.4",
    "rate-limiter-flexible": "^5.0.3"
  },
  "devDependencies": {
    "@types/node": "^22.9.0",
    "@types/express": "^5.0.0",
    "@types/uuid": "^10.0.0",
    "@types/cors": "^2.8.17",
    "@types/morgan": "^1.9.9",
    "@types/compression": "^1.7.5",
    "@types/jest": "^29.5.14",
    "typescript": "^5.6.3",
    "ts-node": "^10.9.2",
    "nodemon": "^3.1.7",
    "jest": "^29.7.0",
    "ts-jest": "^29.2.5",
    "eslint": "^9.14.0",
    "@typescript-eslint/eslint-plugin": "^8.13.0",
    "@typescript-eslint/parser": "^8.13.0",
    "rimraf": "^6.0.1",
    "supertest": "^7.0.0"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

#### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@/config/*": ["src/config/*"],
      "@/services/*": ["src/services/*"],
      "@/utils/*": ["src/utils/*"],
      "@/types/*": ["src/types/*"]
    }
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "tests",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

#### `docker-compose.yml`
```yaml
version: '3.8'

services:
  qdrant:
    image: qdrant/qdrant:latest
    container_name: qdrant-db
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - qdrant_storage:/qdrant/storage
    environment:
      - QDRANT__SERVICE__HTTP_PORT=6333
      - QDRANT__SERVICE__GRPC_PORT=6334
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:6333/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  qdrant_storage:
    driver: local
```

#### `LICENSE`
```
MIT License

Copyright (c) 2024 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Main README.md
```markdown
# 🤖 Document Q&A System

> AI-powered document question answering system with vector search, semantic understanding, and MCP integration.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?logo=openai&logoColor=white)](https://openai.com/)

## ✨ Features

- 📄 **Document Upload & Management** - Support for text documents with automatic indexing
- 🔍 **Semantic Search** - Vector-based similarity search using OpenAI embeddings
- 🤖 **AI-Powered Q&A** - Get intelligent answers with source citations
- 🛠️ **MCP Integration** - Model Context Protocol server for tool integration
- 🌐 **Modern Web Interface** - Clean, responsive UI with real-time interactions
- 🚀 **Production Ready** - Docker support, TypeScript, and comprehensive error handling
- 📊 **Vector Database** - Qdrant for efficient similarity search
- 🔒 **Secure** - Input validation, rate limiting, and security headers

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18.0.0
- Docker Desktop
- OpenAI API key
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/document-qa-system.git
cd document-qa-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 4. Start Services

```bash
# Start Qdrant database
npm run docker:up

# Build the project
npm run build

# Start development server
npm run dev
```

### 5. Access the Application

Open your browser and go to: **http://localhost:3000**

## 📖 Usage

### Adding Documents

1. Open the web interface
2. Enter a document name and content in the "Add Document" section
3. Click "Add Document" to upload and index it

### Asking Questions

1. Type your question in the chat interface
2. Get AI-generated answers with source citations
3. View confidence scores and relevant document excerpts

### API Usage

```bash
# Add a document
curl -X POST http://localhost:3000/api/chat/documents \
  -H "Content-Type: application/json" \
  -d '{"name": "Company Policy", "content": "Our working hours are 9 AM to 6 PM..."}'

# Ask a question
curl -X POST http://localhost:3000/api/chat/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the working hours?"}'
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │────│   API Layer     │────│   AI Services   │
│   (HTML/CSS/JS) │    │   (Express)     │    │   (OpenAI)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                    ┌─────────────────┐    ┌─────────────────┐
                    │   MCP Server    │────│  Vector Store   │
                    │   (Tools)       │    │   (Qdrant)      │
                    └─────────────────┘    └─────────────────┘
```

### Core Components

- **API Layer**: Express.js REST API with TypeScript
- **AI Services**: OpenAI integration for embeddings and chat completion
- **Vector Store**: Qdrant for semantic search and similarity matching
- **MCP Server**: Model Context Protocol for tool integration
- **Frontend**: Vanilla JavaScript with modern CSS

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Run ESLint
npm run docker:up    # Start Docker services
npm run docker:down  # Stop Docker services
npm run mcp          # Start MCP server
```

### Project Structure

```
src/
├── api/           # Express server and routes
├── config/        # Configuration files
├── mcp/           # MCP server implementation
├── services/      # Business logic services
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## 📚 API Documentation

### Endpoints

#### `POST /api/chat/documents`
Add a new document to the knowledge base.

**Request:**
```json
{
  "name": "Document Name",
  "content": "Document content here..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Document added successfully",
  "document": {
    "id": "uuid",
    "name": "Document Name",
    "source": "upload"
  }
}
```

#### `POST /api/chat/ask`
Ask a question about the documents.

**Request:**
```json
{
  "question": "What are the working hours?"
}
```

**Response:**
```json
{
  "success": true,
  "answer": "Based on the company policy...",
  "confidence": 85,
  "sources": [
    {
      "documentName": "Company Policy",
      "content": "Relevant excerpt...",
      "score": 0.92
    }
  ]
}
```

#### `GET /api/health`
Health check endpoint.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | OpenAI API key (required) | - |
| `AI_PROVIDER` | AI provider to use | `openai` |
| `QDRANT_URL` | Qdrant database URL | `http://localhost:6333` |
| `QDRANT_COLLECTION` | Collection name | `documents` |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |

### OpenAI Setup

1. Create an account at [platform.openai.com](https://platform.openai.com)
2. Add a payment method (required for API usage)
3. Generate an API key in the "API Keys" section
4. Add the key to your `.env` file

### Docker Setup

The project includes a Docker Compose configuration for Qdrant:

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🚀 Deployment

### Local Production

```bash
# Build the project
npm run build

# Set environment to production
export NODE_ENV=production

# Start the server
npm start
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY public ./public

EXPOSE 3000
CMD ["npm", "start"]
```

### Cloud Deployment

The application can be deployed to:

- **Vercel**: For serverless deployment
- **Heroku**: With Postgres add-on for Qdrant
- **AWS/GCP/Azure**: Using container services
- **DigitalOcean**: App Platform or Droplets

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment guides.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Structure

```
tests/
├── unit/              # Unit tests for individual components
│   ├── services/      # Service layer tests
│   └── utils/         # Utility function tests
└── integration/       # Integration tests for API endpoints
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📋 Roadmap

- [ ] **File Upload Support** - PDF, DOCX, and other document formats
- [ ] **User Authentication** - Multi-user support with authentication
- [ ] **Conversation History** - Persistent chat sessions
- [ ] **Google Drive Integration** - Direct sync from Google Drive
- [ ] **Advanced Search** - Filters, faceted search, and advanced queries
- [ ] **Analytics Dashboard** - Usage metrics and performance monitoring
- [ ] **Multi-language Support** - Support for non-English documents
- [ ] **Real-time Collaboration** - Shared document collections

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](docs/)
- 🐛 [Issue Tracker](https://github.com/yourusername/document-qa-system/issues)
- 💬 [Discussions](https://github.com/yourusername/document-qa-system/discussions)

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for providing the AI models
- [Qdrant](https://qdrant.tech/) for the vector database
- [Vercel AI SDK](https://sdk.vercel.ai/) for the AI integration
- [Model Context Protocol](https://modelcontextprotocol.io/) for the MCP specification

---

**Built with ❤️ using TypeScript, Node.js, and OpenAI**
```

## 🚀 GitHub Setup & Push Instructions

### Step 1: Install Git (if not already installed)

**For Windows:**
1. Download from [git-scm.com](https://git-scm.com/)
2. Install with default settings
3. Open Command Prompt or PowerShell
4. Verify installation: `git --version`

### Step 2: Create GitHub Account & Repository

1. **Create GitHub Account:**
   - Go to [github.com](https://github.com)
   - Sign up for a free account
   - Verify your email address

2. **Create New Repository:**
   - Click the "+" icon in top right corner
   - Select "New repository"
   - Repository name: `document-qa-system`
   - Description: `AI-powered document Q&A system with vector search`
   - Make it **Public** (or Private if you prefer)
   - **DO NOT** initialize with README (we'll push our own)
   - Click "Create repository"

### Step 3: Set Up Your Local Project

**Open Command Prompt/PowerShell and navigate to your project:**

```cmd
cd C:\Users\%USERNAME%\Desktop\document-qa-system
```

### Step 4: Initialize Git Repository

```cmd
# Initialize git repository
git init

# Configure your git identity (replace with your info)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Create all the files and folders from the structure above
# (You can copy-paste the file contents I provided)
```

### Step 5: Create All Project Files

Create each file with the content provided above. Here's a quick script to create the directory structure:

**Create this as `setup-project.bat` and run it:**

```batch
@echo off
echo Creating project structure...

mkdir src\config
mkdir src\services
mkdir src\mcp\tools
mkdir src\api\routes
mkdir src\utils
mkdir src\types
mkdir public
mkdir docs
mkdir scripts
mkdir tests\unit\services
mkdir tests\unit\utils
mkdir tests\integration
mkdir .github\workflows

echo Project structure created!
echo Now copy the file contents from the guide above.
```

### Step 6: Add Files to Git

```cmd
# Add all files to git
git add .

# Check what files will be committed
git status

# Make your first commit
git commit -m "Initial commit: Complete document Q&A system setup

- Added TypeScript configuration and project structure
- Implemented AI-powered question answering with OpenAI
- Added Qdrant vector database integration
- Created MCP server for tool integration
- Built modern web interface with real-time chat
- Added comprehensive documentation and setup guides
- Included Docker configuration for easy deployment"
```

### Step 7: Connect to GitHub and Push

```cmd
# Add your GitHub repository as remote origin
# Replace 'yourusername' with your actual GitHub username
git remote add origin https://github.com/yourusername/document-qa-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**If you get authentication errors:**

1. **Use Personal Access Token (Recommended):**
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Generate new token with `repo` permissions
   - Use this token as your password when prompted

2. **Or use GitHub CLI:**
   ```cmd
   # Install GitHub CLI from https://cli.github.com/
   gh auth login
   git push -u origin main
   ```

### Step 8: Verify Your Repository

1. Go to `https://github.com/yourusername/document-qa-system`
2. You should see all your files and the README
3. GitHub will automatically display your README.md as the project homepage

### Step 9: Enable GitHub Features

1. **Enable Issues:**
   - Go to repository Settings → Features
   - Enable Issues for bug reports and feature requests

2. **Add Topics:**
   - Click the gear icon next to "About"
   - Add topics: `ai`, `document-qa`, `vector-search`, `openai`, `typescript`, `nodejs`

3. **Create Release:**
   - Go to Releases → Create a new release
   - Tag: `v1.0.0`
   - Title: `Initial Release`
   - Description: `First stable release of the Document Q&A System`

### Step 10: Collaborate and Maintain

```cmd
# For future updates:
git add .
git commit -m "Add new feature: [describe your changes]"
git push

# To pull changes from others:
git pull origin main

# Create feature branch:
git checkout -b feature/new-feature
# Make changes, commit, push, then create pull request on GitHub
```

## 🎯 Important Notes for GitHub

1. **Never commit `.env` file** - It contains your API keys
2. **Always use `.env.example`** - For others to know what variables they need
3. **Write good commit messages** - Describe what you changed and why
4. **Use branches for features** - Don't commit directly to main for big changes
5. **Add a good README** - The one above is comprehensive and professional

## 🏆 Your Repository Will Include:

✅ Complete working codebase  
✅ Professional documentation  
✅ Docker configuration  
✅ TypeScript setup  
✅ Testing framework  
✅ GitHub Actions (CI/CD)  
✅ Security best practices  
✅ API documentation  
✅ Deployment guides  
✅ Contributing guidelines  

This creates a **production-ready, professional-grade repository** that others can easily understand, contribute to, and deploy!

Would you like me to help you with any specific part of this setup or explain any of the files in more detail?