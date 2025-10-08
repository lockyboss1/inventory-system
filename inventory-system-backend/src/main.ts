import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SeederService } from './seeder/seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const seederService = app.get(SeederService);

  try {
    // Automatically seed only if database is empty
    const isSeeded = await seederService.isDatabaseSeeded();
    if (!isSeeded) {
      console.log('🌱 Database empty. Running seeder...');
      await seederService.runSeed();
    } else {
      console.log('✅ Database already seeded. Skipping seeding.');
    }
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  }

  // ✅ Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('Inventory Management API')
    .setDescription(
      'API for managing products, suppliers, warehouses, and purchase orders',
    )
    .setVersion('1.0')
    .addTag('Products')
    .addTag('Purchase Orders')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`Server running on http://localhost:3000`);
  console.log(`Swagger docs available at http://localhost:3000/api`);
}
bootstrap();
