import express from 'express';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

// Serve static files from the client build
app.use(express.static(join(__dirname, 'dist/client')));

// API routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'SearchStory API'
  });
});

app.get('/api/problem-statement', (req, res) => {
  try {
    // Try to read the problem statement file
    const filePath = join(__dirname, 'problem_statement.txt');
    if (fs.existsSync(filePath)) {
      const text = fs.readFileSync(filePath, 'utf-8');
      res.type('text/plain').send(text);
    } else {
      // Fallback to a default message
      res.type('text/plain').send('Problem statement not available.');
    }
  } catch (err) {
    console.error('Error reading problem statement:', err);
    res.type('text/plain').status(500).send('Failed to load problem statement.');
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist/client', 'index.html'));
});

export default app;