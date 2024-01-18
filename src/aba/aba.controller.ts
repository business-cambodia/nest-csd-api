import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AbaService } from './aba.service';

@Controller('aba')
export class AbaController {
  constructor(private readonly abaService: AbaService) {}

  @Post('')
  create(@Body() createAbaDto: any) {
    // console.log(createAbaDto);
    return this.abaService.requestPayment(createAbaDto);
  }

  @Get()
  findAll() {
    return 'a';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.abaService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.abaService.remove(+id);
  }
}
