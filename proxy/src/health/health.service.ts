import { Injectable } from '@nestjs/common'

@Injectable()
export class HealthService {
  private readonly startTime = Date.now()
  private readonly startDate = new Date()

  convertToMb(bytes: number) {
    return Math.round((bytes / 1024 / 1024) * 100) / 100 + 'MB'
  }

  getUptimeInSeconds() {
    return Math.round((Date.now() - this.startTime) / 1000) + 's'
  }

  getStatus() {
    const mem = process.memoryUsage()

    return {
      uptime: this.getUptimeInSeconds(),
      startTime: this.startDate,
      node: process.version,
      memoryUsage: this.convertToMb(mem.heapUsed),
    }
  }
}
