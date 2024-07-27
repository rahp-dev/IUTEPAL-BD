import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Render,
  Redirect,
  HttpCode,
  Put,
} from '@nestjs/common';
import { ClientesService } from './clientes.service'; // Ajusta la importación según tu estructura de carpetas
import { Public } from '@auth/decorators/public.decorator'; // Asegúrate de que la importación es correcta

@Public()
@Controller('views')
export class ViewsController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  @Render('index')
  async getHome() {
    const clientes = await this.clientesService.findAll();
    return { message: 'Sistema de ventas ', clientes };
  }

  @Post('create')
  @HttpCode(302)
  @Redirect('/views')
  async createCliente(
    @Body()
    body: {
      nombre: string;
      email: string;
      telefono?: string;
      direccion?: string;
      producto: string;
      cantidad: string; // Esto será tratado como string
      precio_total: string; // Esto será tratado como string
    },
  ) {
    const {
      nombre,
      email,
      telefono,
      direccion,
      producto,
      cantidad,
      precio_total,
    } = body;

    const cliente = await this.clientesService.create({
      nombre,
      email,
      telefono,
      direccion,
    });
    await this.clientesService.addVenta(cliente.id, {
      producto,
      cantidad,
      precio_total,
    });

    return { url: '/views' };
  }

  @Post('delete/:id')
  @HttpCode(302)
  @Redirect('/views')
  async deleteCliente(@Param('id') id: number) {
    // Primero eliminar todas las ventas asociadas al cliente
    const cliente = await this.clientesService.findOne(id);
    if (cliente) {
      for (const venta of cliente.ventas) {
        await this.clientesService.removeVenta(venta.id);
      }
      await this.clientesService.remove(id);
    }
    return { url: '/views' };
  }

  @Put('update-cliente/:id')
  @HttpCode(302)
  @Redirect('/views')
  async updateCliente(
    @Param('id') id: number,
    @Body()
    body: {
      nombre?: string;
      email?: string;
      telefono?: string;
      direccion?: string;
    },
  ) {
    await this.clientesService.updateCliente(id, body);
    return { url: '/views' };
  }

  @Put('update-venta/:id')
  @HttpCode(302)
  @Redirect('/views')
  async updateVenta(
    @Param('id') id: number,
    @Body()
    body: {
      producto?: string;
      cantidad?: string; // Esto será tratado como string
      precio_total?: string; // Esto será tratado como string
    },
  ) {
    await this.clientesService.updateVenta(id, body);
    return { url: '/views' };
  }
}
