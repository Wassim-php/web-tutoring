import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { seedTopics } from './database/seeds/topic.seed';
import { DataSource } from 'typeorm';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT','PATCH',  'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  // Configure static file serving
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });
app.useWebSocketAdapter(new IoAdapter(app));
  // Run seeds
  const dataSource = app.get(DataSource);
  await seedTopics(dataSource);
  console.log('Database seeding completed');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
