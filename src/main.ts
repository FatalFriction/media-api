import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

let cachedApp: any;

/**
 * Create and initialize the NestJS app (used both in local and Vercel)
 */
async function createApp() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend requests
  app.enableCors();

  // Enable global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Michael Porto API')
    .setDescription('Portfolio CMS + Auth + Cloudflare R2')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // ✅ Use '/docs' instead of '/api' to avoid route conflicts
  SwaggerModule.setup('docs', app, document);

  // Initialize the app (do not listen — required for Vercel)
  await app.init();

  // ✅ Return the underlying HTTP handler (Express instance)
  return app.getHttpAdapter().getInstance();
}

/**
 * Vercel serverless entry point
 */
export default async function handler(req: any, res: any) {
  if (!cachedApp) cachedApp = await createApp();
  return cachedApp(req, res);
}

/**
 * Local development mode — runs on port 3000
 */
if (process.env.NODE_ENV !== 'production') {
  (async () => {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    const config = new DocumentBuilder()
      .setTitle('Michael Porto API')
      .setDescription('Local development')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.listen(3000);
    console.log('✅ Server running at: http://localhost:3000/docs');
  })();
}
