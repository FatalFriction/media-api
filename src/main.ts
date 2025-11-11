import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import * as path from 'path';

let cachedApp: any;

async function createApp() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Michael Porto API')
    .setDescription('Portfolio CMS + Auth + Cloudflare R2')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const server = app.getHttpAdapter().getInstance();
  
  const swaggerPath = path.join(__dirname, '..', 'swagger-static');
  server.use('/api', express.static(swaggerPath));

  // Swagger UI dengan CDN
  server.get('/api', (req: any, res: any) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Michael Porto API</title>
        <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
        <style>
          body { margin: 0; padding: 0; background: #0f172a; }
          .swagger-ui .topbar { background: #1e293b; }
          .swagger-ui .topbar .download-url-wrapper { display: none; }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
        <script>
          window.onload = () => {
            window.ui = SwaggerUIBundle({
              spec: ${JSON.stringify(document)},
              dom_id: '#swagger-ui',
              presets: [SwaggerUIBundle.presets.apis],
              layout: "BaseLayout"
            });
          };
        </script>
      </body>
      </html>
    `);
  });

  await app.init();
  return server;
}

export default async function handler(req: any, res: any) {
  if (!cachedApp) cachedApp = await createApp();
  return cachedApp(req, res);
}

// Local dev
if (process.env.NODE_ENV !== 'production') {
  (async () => {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    const config = new DocumentBuilder()
      .setTitle('Michael Porto API')
      .setDescription('Local dev')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    await app.listen(3000);
    console.log('Swagger: http://localhost:3000/api');
  })();
}