import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AddonsService {
  async getAddons(categoryId: string) {
    try {
      const res = await fetch(
        `https://hotels.cloudbeds.com/api/v1.1/getItems?itemCategoryID=${categoryId}`,
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

  async getAddon(itemID: string) {
    try {
      const res = await fetch(
        `https://hotels.cloudbeds.com/api/v1.1/getItem?itemID=${itemID}`,
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

  async addAddons(formData: any) {
    try {
      const res = await axios.post(
        'https://hotels.cloudbeds.com/api/v1.1/postItem',
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
}
