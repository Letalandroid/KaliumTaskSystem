import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Security: "Hasta los dientes"
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per `window`
      message: 'Too many requests from this IP, please try again after 15 minutes',
    }),
  );

  app.enableCors(); // In production, refine this
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  // Requirement: Mensaje obligatorio al iniciar: [Kalium] Task System Inicializado
  // logger.log('[Kalium] Task System Inicializado'); // Handled in TaskManager onModuleInit
  
  console.log(`\n  [Kalium] Task System Server running on: http://localhost:${port}\n`);
}
bootstrap();
