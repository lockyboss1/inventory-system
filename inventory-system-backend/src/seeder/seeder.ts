import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeederService } from './seeder.service';
import { SeederModule } from './seeder.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seederService = app
    .select(SeederModule)
    .get(SeederService, { strict: true });
  await seederService.runSeed();
  await app.close();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
