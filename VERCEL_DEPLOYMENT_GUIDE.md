# Vercel Deployment Guide for SearchStory

This guide explains how to deploy the SearchStory application to Vercel.

## Prerequisites

1. A GitHub, GitLab, or Bitbucket account
2. A Vercel account (free at [vercel.com](https://vercel.com))
3. Node.js installed locally (for testing)

## Project Structure for Vercel

The application is structured to work with Vercel's serverless functions:

- Frontend: React + Vite (TypeScript)
- Backend: Express.js API endpoints (TypeScript)
- Build process: Vite for frontend, esbuild for backend
- Entry point for Vercel: `server/vercel-server.ts`

## Deployment Methods

### Method 1: Deploy from Git Repository (Recommended)

1. **Push your code to a Git repository**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign in or create an account
   - Click "New Project"
   - Import your Git repository

3. **Configure Project**
   Vercel will automatically detect the project settings:
   - Framework: Other
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your application will be live!

### Method 2: Deploy with Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow the prompts**
   - Set up and deploy? Yes
   - Which scope? Your Vercel account
   - Link to existing project? No (or yes if you already created one)
   - What's your project's name? searchstory
   - In which directory is your code located? ./

4. **Production deployment**
   ```bash
   vercel --prod
   ```

## Configuration Files

### vercel.json
This file configures how Vercel builds and deploys the application:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/vercel-server.ts",
      "use": "@vercel/node",
      "config": {
        "includeFiles": [
          "dist/**",
          "client/**",
          "server/**",
          "shared/**",
          "attached_assets/**"
        ]
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/vercel-server.ts"
    },
    {
      "src": "/(.*)",
      "dest": "server/vercel-server.ts"
    }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public"
}
```

### server/vercel-server.ts
This is the entry point for Vercel's serverless functions, which:
- Sets up the Express application
- Registers API routes
- Handles static file serving in production
- Exports the app for Vercel

## Environment Variables

Vercel automatically sets `NODE_ENV=production` for production deployments. The application uses this to:

- Serve static files from the `dist/public` directory
- Use the production database configuration (when implemented)
- Disable development-only features

To add custom environment variables:
1. In Vercel dashboard: Project Settings → Environment Variables
2. With CLI: `vercel env add VARIABLE_NAME`

## API Endpoints

The application provides the following API endpoints:

- `GET /api/health` - Health check endpoint
- `GET /api/vercel` - Vercel-specific health check
- `GET /api/problem-statement` - Returns the problem statement text

## Custom Domain

To use a custom domain:

1. In Vercel dashboard: Project Settings → Domains
2. Add your domain
3. Follow the DNS configuration instructions
4. Vercel will automatically provision an SSL certificate

## Troubleshooting

### Common Issues

1. **Build fails**
   - Check that all dependencies are in `dependencies` (not `devDependencies`)
   - Ensure the build command in `package.json` works locally
   - Check the build logs in Vercel dashboard

2. **API endpoints not working**
   - Verify routes are registered with `/api/` prefix
   - Check that the server file exports the app correctly

3. **Static files not served**
   - Ensure the build process creates files in `dist/public`
   - Check that `outputDirectory` in `vercel.json` is correct

### Debugging

1. **Check build logs**
   - Vercel dashboard → Deployments → Latest deployment → View Logs

2. **Test locally**
   ```bash
   npm run build
   npm run start
   ```

3. **Verify configuration**
   ```bash
   npm run vercel:check
   ```

## Monitoring and Analytics

Vercel provides built-in monitoring:
- Real-time logs
- Performance metrics
- Uptime monitoring
- Error tracking

## Scaling

Vercel automatically scales your application:
- Serverless functions scale automatically
- Global CDN for static assets
- Automatic SSL certificates
- Edge network for global distribution

## Updating Your Deployment

To update your deployed application:

1. **Push changes to your Git repository**
   ```bash
   git add .
   git commit -m "Update application"
   git push origin main
   ```

2. **Vercel will automatically deploy**
   - New deployments are created for each push
   - Previous deployments are preserved
   - Rollback is possible through the dashboard

## Local Development vs Production

| Feature | Development | Production |
|---------|-------------|------------|
| Server | `server/index.ts` | `server/vercel-server.ts` |
| Frontend | Vite dev server | Static files from `dist/public` |
| API Routes | `/api/*` | `/api/*` |
| Logging | Console | Vercel logs |
| Environment | `NODE_ENV=development` | `NODE_ENV=production` |

## Support

For issues with this deployment:
1. Check the [Vercel documentation](https://vercel.com/docs)
2. Review the build logs in your Vercel dashboard
3. Ensure your repository has the required configuration files