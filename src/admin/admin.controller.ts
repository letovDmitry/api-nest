import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from './guard/admin.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(AdminGuard)
  @Post('')
  createBooster(@Body() dto: { email: string, password: string }) {
    return this.adminService.createBooster(dto)
  }

  @UseGuards(AdminGuard)
  @Get('')
  getBoosters() {
    return this.adminService.getBoosters()
  }

  @UseGuards(AdminGuard)
  @Patch('approve')
  approveBooster(@Body() dto: { boosterId: number }) {
    return this.adminService.approveBooster(dto.boosterId)
  }

  @UseGuards(AdminGuard)
  @Patch('cancel')
  cancelBooster(@Body() dto: { boosterId: number }) {
    return this.adminService.cancelBooster(dto.boosterId)
  }

  @UseGuards(AdminGuard)
  @Delete('')
  deleteBooster(@Body() dto: { boosterId: number }) {
    return this.adminService.deleteBooster(dto.boosterId)
  }
}
