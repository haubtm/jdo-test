import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtGuard } from './jwt.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('auth/register')
  register(@Body() body: { password: string }) {
    return this.appService.register(body);
  }

  @Post('auth/login')
  login(@Body() body: { vaultId: string; password: string }) {
    return this.appService.login(body);
  }

  @UseGuards(JwtGuard)
  @Get('vault')
  listVault(@Req() request: { user: { sub: string } }) {
    return this.appService.listVault(request.user.sub);
  }

  @UseGuards(JwtGuard)
  @Post('vault')
  createVault(@Req() request: { user: { sub: string } }, @Body() body: { service: string; username: string; password: string; note?: string }) {
    return this.appService.createVault({ userId: request.user.sub, ...body });
  }

  @UseGuards(JwtGuard)
  @Put('vault/:id')
  updateVault(
    @Req() request: { user: { sub: string } },
    @Param('id') id: string,
    @Body() body: { service?: string; username?: string; password?: string; note?: string },
  ) {
    return this.appService.updateVault({ userId: request.user.sub, credentialId: id, ...body });
  }

  @UseGuards(JwtGuard)
  @Delete('vault/:id')
  deleteVault(@Req() request: { user: { sub: string } }, @Param('id') id: string) {
    return this.appService.deleteVault({ userId: request.user.sub, credentialId: id });
  }
}
