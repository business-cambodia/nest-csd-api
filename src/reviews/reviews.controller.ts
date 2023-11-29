import { Controller, Get } from '@nestjs/common';

@Controller('reviews')
export class ReviewsController {
  @Get()
  async getMaps() {
    const res = await fetch(
      'https://maps.googleapis.com/maps/api/place/details/json?fields=reviews&place_id=ChIJH6JdHrEJCDERgqBGdlxE00E&key=AIzaSyDzeX_CZ3TfqBbNHoJDnGViWHgYkwIjg7Y',
    );
    return res.json();
  }
}
