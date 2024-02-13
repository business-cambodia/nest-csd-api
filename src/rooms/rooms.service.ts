import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AddonsService } from 'src/addons/addons.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RoomsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly addonsService: AddonsService,
  ) {}

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
        formData.add_ons.forEach((element) => {
          element.reservationID = res.data.reservationID;
          this.addonsService.addAddons(element);
        });
      }
      const user = await this.usersService.findOne(formData.userId);
      user.bookings.unshift({
        reservationID: res.data.reservationID,
        tran_id: formData.tran_id,
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

  getRoomPrice = async (
    startDate: string,
    endDate: string,
    roomTypeID: string,
    promoCode: string,
  ) => {
    promoCode = promoCode ? promoCode : '';
    try {
      const res = await fetch(
        `https://hotels.cloudbeds.com/api/v1.1/getRatePlans?startDate=${startDate}&endDate=${endDate}&roomTypeID=${roomTypeID}&promoCode=${promoCode}&detailedRates=true`,
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
  };

  postReservationNote(reservationID: string, note: string) {
    axios.post(
      'https://hotels.cloudbeds.com/api/v1.1/postReservationNote',
      {
        reservationID: reservationID,
        reservationNote: note,
      },
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${process.env.CLOUD_BEDS_TOKEN}`,
        },
      },
    );
  }
}
