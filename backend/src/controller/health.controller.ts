import { Controller, Get } from '@midwayjs/core';

@Controller('/api')
export class HealthController {
  @Get('/health')
  async health() {
    return {
      success: true,
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: '服务正常运行'
    };
  }
}
