#!/usr/bin/env node

// Simple Vercel deployment verification script
console.log('🔍 Verifying Vercel deployment readiness...');

// Check if required files exist
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

const requiredFiles = [
    'vercel.json',
    'package.json',
    'server/vercel-server.ts'
];

const missingFiles = [];

requiredFiles.forEach(file => {
    if (!existsSync(join(process.cwd(), file))) {
        missingFiles.push(file);
    }
});

if (missingFiles.length > 0) {
    console.log('❌ Missing required files for Vercel deployment:');
    missingFiles.forEach(file => console.log(`   - ${file}`));
    process.exit(1);
}

console.log('✅ All required files for Vercel deployment are present');

// Check package.json for build script
const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf8'));

if (!packageJson.scripts || !packageJson.scripts.build) {
    console.log('❌ No build script found in package.json');
    process.exit(1);
}

console.log('✅ Build script found in package.json');

// Check vercel.json configuration
const vercelJson = JSON.parse(readFileSync(join(process.cwd(), 'vercel.json'), 'utf8'));

if (!vercelJson.builds || vercelJson.builds.length === 0) {
    console.log('❌ No builds configuration found in vercel.json');
    process.exit(1);
}

console.log('✅ Vercel builds configuration found');

console.log('\n✅ Your project is ready for Vercel deployment!');
console.log('\nTo deploy to Vercel:');
console.log('1. Push your code to a GitHub repository');
console.log('2. Log in to your Vercel account');
console.log('3. Create a new project and import your repository');
console.log('4. Vercel will automatically detect the project settings and deploy it');
console.log('\nAlternatively, use the Vercel CLI:');
console.log('   npm install -g vercel');
console.log('   vercel');