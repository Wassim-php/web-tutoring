import { PartialType } from '@nestjs/mapped-types';
import { CreateSessionDto } from './create-session.dto';
import { IsString, IsIn } from 'class-validator';

export class UpdateSessionDto extends PartialType(CreateSessionDto) {}

export class UpdateSessionStatusDto {
  @IsString()
  @IsIn(['pending', 'accepted', 'rejected'])
  status: string;
}
