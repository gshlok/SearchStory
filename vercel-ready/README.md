# Search Story - Vercel Ready

This is a Vercel-optimized version of the Search Story application.

## Structure

- `src/` - React frontend source code
- `server.js` - Express server for Vercel deployment
- `dist/client/` - Built frontend assets
- `vercel.json` - Vercel deployment configuration

## Deployment

This project is ready to deploy to Vercel:

1. Push this folder to a GitHub repository
2. Connect the repository to Vercel
3. Vercel will automatically detect the configuration and deploy

## Development

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
```

The build process will create optimized assets in `dist/client/` and the server is ready for Vercel deployment.