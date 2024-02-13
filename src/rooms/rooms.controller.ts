import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() formData: any) {
    return this.roomsService.createBooking(formData);
  }

  @Get()
  findAll(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('adult') adults: number,
  ) {
    return this.roomsService.searchRooms(startDate, endDate, adults);
  }

  @Get('promoCode')
  find(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('roomTypeID') roomTypeID: string,
    @Query('promoCode') promoCode: string,
  ) {
    return this.roomsService.getRoomPrice(
      startDate,
      endDate,
      roomTypeID,
      promoCode,
    );
  }
}
