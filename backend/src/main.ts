import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './redis-adapter';
import { ThrottlerGuard } from '@nestjs/throttler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const redisAdapter = new RedisIoAdapter(app);
  await redisAdapter.connectToRedis();

  app.useWebSocketAdapter(redisAdapter);

  app.enableCors();

  await app.listen(3000);

  app.useGlobalGuards(app.get(ThrottlerGuard));
}
void bootstrap();
