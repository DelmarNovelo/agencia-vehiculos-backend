import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('pdf')
@UseGuards(AuthGuard('jwt'))
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('venta/:id')
  async getPdfVenta(@Param('id') id: string, @Res() res: Response) {
    try {
      const ventaId = parseInt(id, 10);
      const pdfBuffer = await this.pdfService.generarPdfVenta(ventaId);

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename=venta-${ventaId}.pdf`,
        'Content-Length': pdfBuffer.length,
      });

      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
