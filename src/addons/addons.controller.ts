import { Controller, Get, Param } from '@nestjs/common';
import { AddonsService } from './addons.service';

@Controller('addons')
export class AddonsController {
  constructor(private readonly addonsService: AddonsService) {}

  @Get(':categoryId')
  findAll(@Param('categoryId') categoryId: string) {
    return this.addonsService.getAddons(categoryId);
  }
}
