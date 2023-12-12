import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from 'src/decorator/match.decorator';

export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  otp_code: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  newPassword: string;

  @IsString()
  @Match('newPassword', { message: 'Confirm password must match password' })
  confirmPassword: string;
}
