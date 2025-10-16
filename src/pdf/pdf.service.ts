import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import { Venta } from '../ventas/entities/venta.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Persona } from '../personas/entities/persona.entity';
import { ItemVenta } from '../items-venta/entities/item-venta.entity';
import { Vehiculo } from '../vehiculos/entities/vehiculo.entity';
import { UnidadVehicular } from '../unidades-vehiculares/entities/unidad-vehicular.entity';
import { Modelo } from '../modelos/entities/modelo.entity';
import { Marca } from '../marcas/entities/marca.entity';

const pdfMakePrinter = require('pdfmake/src/printer');

const fonts = {
  Roboto: {
    normal: join(__dirname, '..', 'public', 'fonts', 'poppins', 'Poppins-Regular.ttf'),
    bold: join(__dirname, '..', 'public', 'fonts', 'poppins', 'Poppins-Bold.ttf'),
    italics: join(__dirname, '..', 'public', 'fonts', 'poppins', 'Poppins-Italic.ttf'),
    bolditalics: join(__dirname, '..', 'public', 'fonts', 'poppins', 'Poppins-BoldItalic.ttf'),
  },
  GreatVibes: {
    normal: join(__dirname, '..', 'public', 'fonts', 'great_vibes', 'GreatVibes-Regular.ttf'),
  }
};

const pdfMakeStyles = {
  textTiny: {
    fontSize: 6,
  },
  textSmall: {
    fontSize: 8,
  },
  textMedium: {
    fontSize: 10,
  },
  textLarge: {
    fontSize: 12,
  },
  h1: {
    fontSize: 10,
    bold: true,
  },
  h2: {
    fontSize: 9,
    bold: true,
  },
  h3: {
    fontSize: 8,
    bold: true,
  },
  bodyLarge: {
    fontSize: 8,
  },
  bodyMedium: {
    fontSize: 7,
  },
  bodySmall: {
    fontSize: 6,
  },
  labelLarge: {
    fontSize: 8,
    bold: true,
  },
  labelMedium: {
    fontSize: 7,
    bold: true,
  },
  labelSmall: {
    fontSize: 6,
    bold: true,
  },
  textBold: {
    bold: true,
  },
  textCenter: {
    alignment: 'center'
  },
  textRight: {
    alignment: 'right'
  },
  textWhite: {
    color: '#ffffff'
  },
  textRed: {
    color: '#e92525'
  },
  mt10: {
    margin: [0, 10, 0, 0]
  },
  mb3: {
    margin: [0, 0, 0, 3]
  },
  mb5: {
    margin: [0, 0, 0, 5]
  },
  mb8: {
    margin: [0, 0, 0, 8]
  },
  GreatVibesFont: {
    font: 'GreatVibes'
  }
}

const printer = new pdfMakePrinter(fonts);

@Injectable()
export class PdfService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
  ) {}

  async generarPdfVenta(ventaId: number) {
    try {
      // Obtener la venta con todas las relaciones necesarias
      const venta = await this.ventaRepository.findOne({
        where: { id: ventaId },
        relations: [
          'cliente',
          'cliente.persona',
          'ventaItems',
          'ventaItems.unidadVehicular',
          'ventaItems.unidadVehicular.vehiculo',
          'ventaItems.unidadVehicular.vehiculo.modelo',
          'ventaItems.unidadVehicular.vehiculo.linea',
          'ventaItems.unidadVehicular.vehiculo.linea.marca',
          'usuario',
          'metodoPago',
          'factura'
        ]
      });

      if (!venta) {
        throw new Error('Venta no encontrada');
      }

      const clienteNombre = `${venta.cliente.persona.nombre} ${venta.cliente.persona.apellido}`;
      const fechaVenta = new Date(venta.fecha).toLocaleDateString('es-GT');
      const items = venta.ventaItems.map(item => ({
        descripcion: `${item.unidadVehicular.vehiculo.linea.marca.nombre} ${item.unidadVehicular.vehiculo.linea.nombre} ${item.unidadVehicular.vehiculo.modelo.nombre} - VIN: ${item.unidadVehicular.vin}`,
        cantidad: 1,
        precio: item.precioLista,
        total: item.precioFinal
      }));

      const docDefinition = {
        pageSize: 'LETTER',
        pageMargins: [40, 60, 40, 60],
        styles: pdfMakeStyles,
        content: [
          // Encabezado
          {
            text: 'AGENCIA DE VEHÍCULOS',
            style: 'h1',
            alignment: 'center',
            margin: [0, 0, 0, 20]
          },
          {
            text: 'RECIBO DE VENTA',
            style: 'h2',
            alignment: 'center',
            margin: [0, 0, 0, 30]
          },

          // Información de la venta
          {
            columns: [
              {
                width: '*',
                text: [
                  { text: 'Fecha: ', style: 'labelMedium' },
                  { text: fechaVenta, style: 'bodyMedium' }
                ]
              },
              {
                width: '*',
                text: [
                  { text: 'No. Venta: ', style: 'labelMedium' },
                  { text: venta.id.toString(), style: 'bodyMedium' }
                ],
                alignment: 'right'
              }
            ],
            margin: [0, 0, 0, 10]
          },

          // Información del cliente
          {
            text: 'DATOS DEL CLIENTE',
            style: 'h3',
            margin: [0, 20, 0, 10]
          },
          {
            text: [
              { text: 'Nombre: ', style: 'labelMedium' },
              { text: clienteNombre, style: 'bodyMedium' }
            ],
            margin: [0, 0, 0, 5]
          },

          // Tabla de productos
          {
            text: 'DETALLE DE LA VENTA',
            style: 'h3',
            margin: [0, 20, 0, 10]
          },
          {
            table: {
              headerRows: 1,
              widths: ['*', 50, 80, 80],
              body: [
                [
                  { text: 'Descripción', style: 'labelSmall' },
                  { text: 'Cant.', style: 'labelSmall', alignment: 'center' },
                  { text: 'Precio', style: 'labelSmall', alignment: 'right' },
                  { text: 'Total', style: 'labelSmall', alignment: 'right' }
                ],
                ...items.map(item => [
                  { text: item.descripcion, style: 'bodySmall' },
                  { text: item.cantidad.toString(), style: 'bodySmall', alignment: 'center' },
                  { text: `Q${item.precio.toFixed(2)}`, style: 'bodySmall', alignment: 'right' },
                  { text: `Q${item.total.toFixed(2)}`, style: 'bodySmall', alignment: 'right' }
                ])
              ]
            },
            margin: [0, 0, 0, 20]
          },

          // Totales
          {
            columns: [
              { width: '*', text: '' },
              {
                width: 200,
                table: {
                  widths: [100, 80],
                  body: [
                    [
                      { text: 'Subtotal:', style: 'labelSmall', alignment: 'right' },
                      { text: `Q${venta.subtotal.toFixed(2)}`, style: 'bodySmall', alignment: 'right' }
                    ],
                    [
                      { text: 'Descuento:', style: 'labelSmall', alignment: 'right' },
                      { text: `Q${venta.descuento.toFixed(2)}`, style: 'bodySmall', alignment: 'right' }
                    ],
                    [
                      { text: 'Total:', style: 'labelMedium', alignment: 'right' },
                      { text: `Q${venta.total.toFixed(2)}`, style: 'bodyMedium', alignment: 'right' }
                    ]
                  ]
                }
              }
            ]
          },

          // Método de pago
          {
            text: [
              { text: 'Método de Pago: ', style: 'labelMedium' },
              { text: venta.metodoPago ? venta.metodoPago.nombre : 'No especificado', style: 'bodyMedium' }
            ],
            margin: [0, 20, 0, 0]
          },

          // Notas
          {
            text: venta.notas ? [
              { text: 'Notas: ', style: 'labelMedium' },
              { text: venta.notas, style: 'bodyMedium' }
            ] : '',
            margin: [0, 10, 0, 0]
          },

          // Pie de página
          {
            text: 'Gracias por su compra',
            style: 'textCenter',
            margin: [0, 30, 0, 0]
          }
        ]
      };

      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      const chunks: Buffer[] = [];

      return new Promise<Buffer>((resolve, reject) => {
        pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
        pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
        pdfDoc.on('error', reject);
        pdfDoc.end();
      });

    } catch (error) {
      throw new Error(`Error generando PDF: ${error.message}`);
    }
  }
}
