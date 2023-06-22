import { object, string } from 'zod'
import { createZodDto } from 'nestjs-zod'

const loginDto = object({
  username: string(),
  password: string(),
})

export class LoginDto extends createZodDto(loginDto) {}
