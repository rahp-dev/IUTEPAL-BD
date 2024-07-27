import { Module } from '@nestjs/common';
import { ViewsService } from './views.service';
import { ViewsController } from './views.controller';
import { ClientesService } from './clientes.service';

@Module({
  controllers: [ViewsController],
  providers: [ViewsService, ClientesService],
})
export class ViewsModule {}
