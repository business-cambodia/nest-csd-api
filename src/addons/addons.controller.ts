import { Controller, Get, Query } from '@nestjs/common';
import { AddonsService } from './addons.service';

@Controller('addons')
export class AddonsController {
  constructor(private readonly addonsService: AddonsService) {}

  @Get()
  findAll() {
    return this.addonsService.getAddons();
  }
}
