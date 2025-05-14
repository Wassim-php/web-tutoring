import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { seedTopics } from './database/seeds/topic.seed';
import { DataSource } from 'typeorm';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ValidationPipe } from '@nestjs/common';
import { ServerOptions } from 'socket.io';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Configure WebSocket with custom options
  const wsOptions: Partial<ServerOptions> = {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
      allowedHeaders: ['authorization', 'Content-Type']
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
    allowEIO3: true
  };

  // Create and configure WebSocket adapter
  const ioAdapter = new IoAdapter(app);
  app.useWebSocketAdapter(ioAdapter);

  // Enable CORS for HTTP requests
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Configure static file serving
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // Use global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Try to find an available port
  const startPort = 3000;
  const endPort = 3010;
  let port: number | undefined;

  for (let tryPort = startPort; tryPort <= endPort; tryPort++) {
    try {
      const server = await app.listen(tryPort);
      port = tryPort;
      console.log(`Server started on port ${port}`);
      break;
    } catch (error) {
      if (error.code !== 'EADDRINUSE') {
        throw error;
      }
      console.log(`Port ${tryPort} is in use, trying next port...`);
    }
  }

  if (!port) {
    throw new Error(`No available ports found between ${startPort} and ${endPort}`);
  }

  // Run seeds
  const dataSource = app.get(DataSource);
  await seedTopics(dataSource);
  console.log('Database seeding completed');

  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap().catch(err => {
  console.error('Bootstrap error:', err);
  process.exit(1);
});
