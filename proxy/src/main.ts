import { NestFactory } from '@nestjs/core'
import { AppModule } from '@/app.module'
import { ZodValidationPipe } from 'nestjs-zod'
import 'dotenv/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors()
  app.useGlobalPipes(new ZodValidationPipe())

  await app.listen(3000)
}

bootstrap()
