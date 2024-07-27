import { Injectable } from '@nestjs/common';
import { PrismaService } from '@core/prisma/services/prisma.service';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.cliente.findMany({
      include: {
        ventas: true, // Incluye ventas si tu modelo tiene esa relación
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.cliente.findUnique({
      where: { id },
      include: { ventas: true },
    });
  }

  async create(data: {
    nombre: string;
    email: string;
    telefono?: string;
    direccion?: string;
  }) {
    return this.prisma.cliente.create({
      data,
    });
  }

  async addVenta(
    clienteId: number,
    ventaData: {
      producto: string;
      cantidad: string; // Esto es recibido como string desde el formulario
      precio_total: string; // Esto es recibido como string desde el formulario
    },
  ) {
    return this.prisma.venta.create({
      data: {
        producto: ventaData.producto,
        cantidad: parseInt(ventaData.cantidad, 10), // Convierte a entero
        precio_total: parseFloat(ventaData.precio_total), // Convierte a número flotante
        fecha_venta: new Date(), // Ajusta la fecha si es necesario
        cliente: {
          connect: {
            id: clienteId,
          },
        },
      },
    });
  }

  async remove(id: number) {
    return this.prisma.cliente.delete({ where: { id } });
  }

  async removeVenta(id: number) {
    return this.prisma.venta.delete({ where: { id } });
  }

  async updateCliente(
    id: number,
    data: {
      nombre?: string;
      email?: string;
      telefono?: string;
      direccion?: string;
    },
  ) {
    return this.prisma.cliente.update({
      where: { id },
      data,
    });
  }

  async updateVenta(
    id: number,
    data: {
      producto?: string;
      cantidad?: string; // Esto se convertirá en número en el controlador
      precio_total?: string; // Esto se convertirá en número en el controlador
    },
  ) {
    return this.prisma.venta.update({
      where: { id },
      data: {
        producto: data.producto,
        cantidad: data.cantidad ? parseInt(data.cantidad, 10) : undefined,
        precio_total: data.precio_total
          ? parseFloat(data.precio_total)
          : undefined,
      },
    });
  }
}
