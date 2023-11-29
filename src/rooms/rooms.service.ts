import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RoomsService {
  async createBooking(formData: any) {
    try {
      const res = await axios.post(
        'https://hotels.cloudbeds.com/api/v1.1/postReservation',
        formData,
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${process.env.CLOUD_BEDS_TOKEN}`,
          },
        },
      );
      return res.data;
    } catch (error) {}
  }

  async searchRooms(startDate: string, endDate: string, adults: number) {
    try {
      const res = await fetch(
        `https://hotels.cloudbeds.com/api/v1.1/getRoomTypes?startDate=${startDate}&endDate=${endDate}&adults=${adults}&detailedRates=false`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.CLOUD_BEDS_TOKEN}`,
          },
        },
      );
      return res.json();
    } catch (error) {
      console.log(error);
    }
  }
}
