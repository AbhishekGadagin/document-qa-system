class DocumentQAApp {
    constructor() {
        this.baseUrl = '/api';
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Upload form
        document.getElementById('uploadForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleDocumentUpload();
        });

        // Chat form
        document.getElementById('chatForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleQuestion();
        });

        // Enter key in question input
        document.getElementById('questionInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleQuestion();
            }
        });
    }

    async handleDocumentUpload() {
        const nameInput = document.getElementById('documentName');
        const contentInput = document.getElementById('documentContent');
        const statusDiv = document.getElementById('uploadStatus');
        const submitButton = document.querySelector('#uploadForm button');

        const name = nameInput.value.trim();
        const content = contentInput.value.trim();

        if (!name || !content) {
            this.showUploadStatus('Please fill in both document name and content', 'error');
            return;
        }

        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="loading"></span> Adding Document...';

        try {
            const response = await fetch(`${this.baseUrl}/chat/documents`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, content }),
            });

            const result = await response.json();

            if (result.success) {
                this.showUploadStatus(`Document "${name}" added successfully!`, 'success');
                nameInput.value = '';
                contentInput.value = '';
            } else {
                this.showUploadStatus(`Error: ${result.error}`, 'error');
            }
        } catch (error) {
            this.showUploadStatus(`Network error: ${error.message}`, 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Add Document';
        }
    }

    async handleQuestion() {
        const questionInput = document.getElementById('questionInput');
        const submitButton = document.querySelector('#chatForm button');
        
        const question = questionInput.value.trim();
        if (!question) return;

        // Add user message to chat
        this.addMessage('user', question);
        
        // Clear input and show loading
        questionInput.value = '';
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="loading"></span> Thinking...';

        // Add loading message
        const loadingMessageId = this.addMessage('assistant', 'Searching documents and generating answer...');

        try {
            const response = await fetch(`${this.baseUrl}/chat/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }),
            });

            const result = await response.json();

            // Remove loading message
            document.getElementById(loadingMessageId).remove();

            if (result.success) {
                this.addMessage('assistant', result.answer, result.sources, result.confidence);
            } else {
                this.addMessage('assistant', `Error: ${result.error}`);
            }
        } catch (error) {
            // Remove loading message
            document.getElementById(loadingMessageId).remove();
            this.addMessage('assistant', `Network error: ${error.message}`);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Ask';
        }
    }

    addMessage(role, content, sources = null, confidence = null) {
        const messagesDiv = document.getElementById('chatMessages');
        const messageId = 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        messageDiv.id = messageId;

        let html = `
            <div class="message-header">${role === 'user' ? '👤 You' : '🤖 Assistant'}</div>
            <div class="message-content">${this.formatMessage(content)}</div>
        `;

        if (confidence !== null) {
            html += `<div style="margin-top: 8px; font-size: 12px; color: #718096;">
                Confidence: ${Math.round(confidence)}%
            </div>`;
        }

        if (sources && sources.length > 0) {
            html += '<div class="sources"><strong>Sources:</strong>';
            sources.forEach((source, index) => {
                html += `
                    <div class="source">
                        📄 ${source.documentName} (Score: ${Math.round(source.score * 100)}%)
                        <div style="margin-left: 15px; font-style: italic;">"${source.content}"</div>
                    </div>
                `;
            });
            html += '</div>';
        }

        messageDiv.innerHTML = html;
        messagesDiv.appendChild(messageDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

        return messageId;
    }

    formatMessage(content) {
        // Simple formatting - convert line breaks to <br>
        return content.replace(/\n/g, '<br>');
    }

    showUploadStatus(message, type) {
        const statusDiv = document.getElementById('uploadStatus');
        statusDiv.textContent = message;
        statusDiv.className = type;
        statusDiv.style.display = 'block';
        
        // Auto-hide success messages after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 3000);
        }
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DocumentQAApp();
});