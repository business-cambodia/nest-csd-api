import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RoomsService {
  constructor(private readonly usersService: UsersService) {}

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
      if (formData.add_ons.length > 0) {
        await axios.post(
          'https://cms.bayoflights-entertainment.com/items/add_ons_bookings',
          {
            add_ons: formData.add_ons,
            total_price: formData.add_ons_total_price,
            cloudbed_reservation_id: res.data.reservationID,
            guest_name: formData.guestFirstName + ' ' + formData.guestLastName,
          },
        );
      }
      const user = await this.usersService.findOne(formData.userId);
      user.bookings.unshift({
        reservationID: res.data.reservationID,
        add_ons: formData.add_ons,
        add_ons_total_price: formData.add_ons_total_price,
      });
      this.usersService.updateBookings(user);
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
