import { IsString, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsString()
  voucherType: string;

  voucherId: string;
}
