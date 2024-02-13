import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import { RoomsService } from 'src/rooms/rooms.service';
import useAba from 'src/composable/useAba';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly roomService: RoomsService,
  ) {}

  async createBooking(body: any) {
    body.tran_id = body.tran_id == undefined ? '' : body.tran_id;
    const transaction = await this.findByTranId(body.tran_id);
    if (!transaction) {
      return { message: 'Transaction not found' };
    } else {
      const req_time = this.req_time();
      const hash = CryptoJS.HmacSHA512(
        `${req_time}${process.env.MERCHANT_ID}${transaction.tran_id}`,
        process.env.PAYWAY_API_KEY,
      ).toString(CryptoJS.enc.Base64);
      const abaTransaction = await useAba.post(
        '/payment-gateway/v1/payments/check-transaction',
        {
          req_time: req_time,
          merchant_id: process.env.MERCHANT_ID,
          tran_id: transaction.tran_id,
          hash: hash,
        },
      );
      if (
        abaTransaction.data.status == 0 &&
        abaTransaction.data.description == 'approved' &&
        transaction.status == false
      ) {
        transaction.payload = Object.assign(transaction.payload, {
          tran_id: transaction.tran_id,
        });
        const reservation = await this.roomService.createBooking(
          transaction.payload,
        );
        this.roomService.postReservationNote(
          reservation.reservationID,
          'Order ID: ' + transaction.tran_id,
        );
        transaction.status = true;
        transaction.reservation_id = reservation.reservationID;
        transaction.success_time = abaTransaction.data.datetime;
        this.update(transaction.id, transaction);
        return { message: 'Booking success!' };
      } else {
        return { message: 'Transaction not success!' };
      }
    }
  }

  create(tran_id: string, unique_tran_id: string) {
    const transaction = this.transactionRepository.create({
      tran_id,
      unique_tran_id,
    });
    return this.transactionRepository.save(transaction);
  }

  hashRequest(
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    rooms: any,
    payment_option: string,
    startDate: string,
    endDate: string,
    add_ons: any,
  ): string {
    rooms = rooms
      .map((room) => {
        return (
          room.roomTypeID +
          '-' +
          room.quantity +
          '-' +
          room.roomsAvailable +
          '-' +
          room?.promoCode
        );
      })
      .toString();
    add_ons = add_ons
      .map((room) => {
        return room.itemID + '-' + room.itemQuantity;
      })
      .toString();
    const combinedString = `${firstname}${lastname}${email}${phone}${rooms}${payment_option}${startDate}${endDate}${add_ons}`;
    const hash = CryptoJS.HmacSHA512(
      combinedString,
      'abc87218-b1ba-4f8f-9fa8-a9e1680a9568',
    );
    const base64 = hash.toString(CryptoJS.enc.Base64);
    return base64;
  }

  req_time() {
    const currentDate = new Date();
    const offsetMinutes = currentDate.getTimezoneOffset();
    currentDate.setMinutes(currentDate.getMinutes() - offsetMinutes);

    const formattedDateTime = currentDate
      .toISOString()
      .replace(/[-T:Z.]/g, '')
      .slice(0, 14);
    return formattedDateTime;
  }

  async findByUniqueId(id: string) {
    const tran = await this.transactionRepository.findOne({
      where: { unique_tran_id: id },
    });
    return tran;
  }

  async findByTranId(id: string) {
    const tran = await this.transactionRepository.findOne({
      where: { tran_id: id },
    });
    return tran;
  }

  update(id: number, updateData: any) {
    return this.transactionRepository.update(id, updateData);
  }
}
