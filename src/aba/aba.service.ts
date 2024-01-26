import { Injectable } from '@nestjs/common';
import useAba from 'src/composable/useAba';
import * as CryptoJS from 'crypto-js';
import { RoomsService } from 'src/rooms/rooms.service';
import { AddonsService } from 'src/addons/addons.service';
import { TransactionsService } from 'src/transactions/transactions.service';

@Injectable()
export class AbaService {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly addonService: AddonsService,
    private readonly transactionService: TransactionsService,
  ) {}

  async requestPayment(body: any) {
    const unique_tran_id = this.transactionService.hashRequest(
      body.guestFirstName,
      body.guestLastName,
      body.guestEmail,
      body.guestPhone,
      body.rooms,
      body.payment_option,
      body.startDate,
      body.endDate,
      body.add_ons,
    );
    const existTransaction = await this.transactionService.findByUniqueId(
      unique_tran_id,
    );
    if (existTransaction) {
      return { data: existTransaction.payway_link };
    } else {
      const tran_id = 'bol-' + Math.floor(Math.random() * 1000000000);
      const transaction = await this.transactionService.create(
        tran_id,
        unique_tran_id,
      );
      const items = [];
      const roomPrice = await body.rooms.reduce(
        async (accumulatorPromise, room) => {
          const accumulator = await accumulatorPromise;
          const roomm = await this.roomsService.getRoomPrice(
            body.startDate,
            body.endDate,
            room.roomTypeID,
          );
          items.push({
            name: room.roomTypeName,
            quantity: +room.quantity,
            price: +roomm.data.roomRate,
          });
          return accumulator + roomm.data.roomRate * room.quantity;
        },
        Promise.resolve(0),
      );

      const addonPrice = await body.add_ons.reduce(
        async (accumulatorPromise, add_on) => {
          const accumulator = await accumulatorPromise;
          const addon = await this.addonService.getAddon(add_on.itemID);
          items.push({
            name: addon.data.name,
            quantity: +add_on.itemQuantity,
            price: addon.data.price,
          });
          return accumulator + addon.data.price * add_on.itemQuantity;
        },
        Promise.resolve(0),
      );
      const price = roomPrice + addonPrice;
      const items64 = btoa(JSON.stringify(items));
      const continue_success_url = '/profile';
      const req_time = this.req_time();
      const return_url =
        'https://api.bayoflights-entertainment.com/transactions';
      const hashh = CryptoJS.HmacSHA512(
        `${req_time}${process.env.MERCHANT_ID}${transaction.tran_id}${price}${items64}${body.guestFirstName}${body.guestLastName}${body.guestEmail}${body.guestPhone}${body.payment_option}${return_url}${continue_success_url}`,
        process.env.PAYWAY_API_KEY,
      );
      const base64 = hashh.toString(CryptoJS.enc.Base64);
      try {
        const sth = await useAba.post('/payment-gateway/v1/payments/purchase', {
          req_time: req_time,
          merchant_id: process.env.MERCHANT_ID,
          tran_id: transaction.tran_id,
          firstname: body.guestFirstName,
          lastname: body.guestLastName,
          email: body.guestEmail,
          phone: body.guestPhone,
          amount: price,
          items: items64,
          return_url: return_url,
          payment_option: body.payment_option,
          continue_success_url: continue_success_url,
          hash: base64,
        });
        transaction.payway_link = sth.request.res.responseUrl;
        transaction.payload = body;
        await this.transactionService.update(transaction.id, transaction);
        return { data: sth.request.res.responseUrl };
      } catch (error) {
        console.log(error);
      }
    }
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

  findOne(id: number) {
    return 'useApi';
  }

  remove(id: number) {
    return `This action removes a #${id} aba`;
  }
}
