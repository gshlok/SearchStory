import fs from 'fs';
import path from 'path';

// Read the problem statement content at build time
const problemStatementPath = path.resolve(process.cwd(), 'problem_statement.txt');
let problemStatementContent = 'Problem statement not found';

try {
  if (fs.existsSync(problemStatementPath)) {
    problemStatementContent = fs.readFileSync(problemStatementPath, 'utf-8');
  } else {
    // Try to read from the repository root
    const altPath = path.resolve(process.cwd(), '..', 'problem_statement.txt');
    if (fs.existsSync(altPath)) {
      problemStatementContent = fs.readFileSync(altPath, 'utf-8');
    }
  }
} catch (err) {
  console.error('Error reading problem statement:', err);
  problemStatementContent = 'Failed to load problem statement.';
}

// Netlify function handler
export async function handler(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/plain'
    },
    body: problemStatementContent
  };
}
