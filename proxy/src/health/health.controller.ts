import { Controller, Get } from '@nestjs/common'
import { HealthService } from '@/health/health.service'

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('status')
  getStatus() {
    return this.healthService.getStatus()
  }
}
