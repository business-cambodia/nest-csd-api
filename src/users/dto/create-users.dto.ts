import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MinLength,
  MaxLength,
} from 'class-validator';
import { Match } from 'src/decorator/match.decorator';

export class CreateUsersDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber('KH')
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsString()
  @Match('password', { message: 'Confirm password must match password' })
  confirmPassword: string;
}
