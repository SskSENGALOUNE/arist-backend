import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { Public } from '../auth/decorators/public.decorator';
import { BannerResponseDto } from './dto/banner-response.dto';
import { GetActiveBannersQuery } from '../../application/banner/queries';

@ApiTags('banners')
@Public()
@Controller({ path: 'banners', version: '1' })
export class BannerController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'List active banners for the landing page' })
  @ApiResponse({
    status: 200,
    description: 'Active banners ordered by sortOrder.',
    type: [BannerResponseDto],
  })
  async findActive(): Promise<BannerResponseDto[]> {
    return this.queryBus.execute(new GetActiveBannersQuery());
  }
}
