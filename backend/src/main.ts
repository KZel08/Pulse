import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './redis-adapter';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const redisAdapter = new RedisIoAdapter(app);
  await redisAdapter.connectToRedis();

  app.useWebSocketAdapter(redisAdapter);

  await app.listen(3000);
}
bootstrap();
