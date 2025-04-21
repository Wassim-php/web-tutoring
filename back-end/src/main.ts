import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { seedTopics } from './database/seeds/topic.seed';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.enableCors();
  
  // Configure static file serving
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // Run seeds
  const dataSource = app.get(DataSource);
  await seedTopics(dataSource);
  console.log('Database seeding completed');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
