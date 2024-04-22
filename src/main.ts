import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const envService = app.get(EnvService);
  const port = envService.get('APP_PORT');

  await app.listen(port as number, () => {
    console.log(`App running on port ${port}`);
  });
}

bootstrap();
