# Deploying Samurai's Quest to Netlify

This guide explains how to deploy the Samurai's Quest application to Netlify.

## Prerequisites

1. A Netlify account (free at [netlify.com](https://netlify.com))
2. This repository cloned to your local machine

## Deployment Steps

### Option 1: Deploy with Netlify CLI (Recommended)

1. Install the Netlify CLI globally:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to your Netlify account:
   ```bash
   netlify login
   ```

3. Build the project:
   ```bash
   npm run build
   ```

4. Deploy to Netlify:
   ```bash
   netlify deploy --prod
   ```
   
   When prompted:
   - Select "Create & configure a new site"
   - Choose your team
   - Enter a site name (or leave blank for auto-generated)
   - For the publish directory, enter: `dist/public`

### Option 2: Deploy via Git (GitHub, GitLab, Bitbucket)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Go to [netlify.com](https://netlify.com) and sign in

3. Click "New site from Git"

4. Connect to your Git provider and select your repository

5. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist/public`

6. Click "Deploy site"

## How It Works

The application is configured to work with Netlify's static hosting and serverless functions:

- The frontend is built using Vite and served as static files
- API endpoints are handled by Netlify Functions (in the `netlify/functions` directory)
- All routing is handled by the client-side router with proper fallback to `index.html`

## Custom Domain (Optional)

To use a custom domain:

1. Go to your site settings in Netlify
2. Navigate to "Domain management"
3. Add your custom domain
4. Follow the DNS configuration instructions

## Troubleshooting

If you encounter issues:

1. Make sure all dependencies are installed:
   ```bash
   npm install
   ```

2. Test the build locally:
   ```bash
   npm run build
   ```

3. Check that the `dist/public` directory contains all necessary files

4. Verify the Netlify functions are working by checking the Netlify logs