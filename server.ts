import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './api/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Mount serverless /api routes
  app.use('/api', apiRouter);

  if (!isProd) {
    // In dev mode, mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve built dist files
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PropLaunch SG Server running at http://0.0.0.0:${PORT}`);
    console.log(`- Health Check: http://0.0.0.0:${PORT}/api/health`);
    console.log(`- URA Vacant Sites: http://0.0.0.0:${PORT}/api/ura-vacant-sites`);
    console.log(`- URA Landed Housing: http://0.0.0.0:${PORT}/api/ura-landed-housing`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
