import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { Public } from '../auth/decorators/public.decorator';
import { SiteSettingResponseDto } from './dto/site-setting-response.dto';
import { GetSiteSettingQuery } from '../../application/site-setting/queries';

@ApiTags('site-settings')
@Public()
@Controller({ path: 'site-settings', version: '1' })
export class SiteSettingController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({
    summary: 'Get public site settings (logo + footer) for any visitor',
  })
  @ApiResponse({
    status: 200,
    description: 'Current site settings.',
    type: SiteSettingResponseDto,
  })
  async get(): Promise<SiteSettingResponseDto> {
    return this.queryBus.execute(new GetSiteSettingQuery());
  }
}
