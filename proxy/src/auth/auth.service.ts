import axios from 'axios'
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common'
import { LoginDto } from '@/auth/auth.dto'
import { Agent } from 'https'

type AuthResponse = {
  authInfo: string
  enabled: true
  realm: string
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)
  private readonly httpClient = axios.create({
    baseURL: process.env.NEST_ENV_SHIB_API_URL,
    httpsAgent: new Agent({
      rejectUnauthorized: false,
    }),
  })

  async login(dto: LoginDto) {
    try {
      const { data } = await this.httpClient.post<AuthResponse>('/auth', dto, {
        timeout: 3000,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      return {
        token: data.authInfo,
      }
    } catch (err) {
      this.logger.error(err)
      throw new UnauthorizedException('Invalid credentials')
    }
  }
}
