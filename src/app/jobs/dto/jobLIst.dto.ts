import { IsNotEmpty } from 'class-validator';
import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
export class jobListQuery {
  @ApiProperty({ type: 'number', minimum: 1, required: false })
  @Optional()
  //   @Min(1, { message: 'Page should be more than 0' })
  page: number;

  @ApiProperty({
    // minimum: 2,
    required: false,
  })
  @Optional()
  //   @Min(0, { message: 'Take should be more than 0' })
  take: number;
}
export class applyJobDto {
  @ApiProperty()
  @IsNotEmpty()
  jobId: string;
}

export class statusChange {
  @ApiProperty()
  status: string;
  @ApiProperty()
  userId: string;
  @ApiProperty()
  feedback?: string;
}
