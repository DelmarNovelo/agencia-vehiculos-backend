import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { EmpresasModule } from './empresas/empresas.module';
import { DireccionesModule } from './direcciones/direcciones.module';
import { DepartamentosModule } from './departamentos/departamentos.module';
import { MunicipiosModule } from './municipios/municipios.module';
import { ClientesModule } from './clientes/clientes.module';
import { PersonasModule } from './personas/personas.module';
import { ContactosModule } from './contactos/contactos.module';
import { EmpleadosModule } from './empleados/empleados.module';
import { MarcasModule } from './marcas/marcas.module';
import { ColoresModule } from './colores/colores.module';
import { CombustiblesModule } from './combustibles/combustibles.module';
import { VehiculosModule } from './vehiculos/vehiculos.module';
import { TransmisionesModule } from './transmisiones/transmisiones.module';
import { TiposVehiculoModule } from './tipos-vehiculo/tipos-vehiculo.module';
import { UnidadesVehicularesModule } from './unidades-vehiculares/unidades-vehiculares.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './helpers/typeorm.config';
import { LineasModule } from './lineas/lineas.module';
import { ModelosModule } from './modelos/modelos.module';
import { PreciosVentaModule } from './precios-venta/precios-venta.module';
import { VentasModule } from './ventas/ventas.module';
import { FacturasModule } from './facturas/facturas.module';
import { FelDocsModule } from './fel-docs/fel-docs.module';
import { ItemsVentaModule } from './items-venta/items-venta.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { ComprasModule } from './compras/compras.module';
import { ContactosProveedorModule } from './contactos-proveedor/contactos-proveedor.module';
import { TiposContactoModule } from './tipos-contacto/tipos-contacto.module';
import { RolesModule } from './roles/roles.module';
import { PermisosModule } from './permisos/permisos.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TiposPagoModule } from './tipos-pago/tipos-pago.module';
import { MetodosPagoModule } from './metodos-pago/metodos-pago.module';
import { ItemsCompraModule } from './items-compra/items-compra.module';
import { CompraDocsModule } from './compra-docs/compra-docs.module';
import { ModuloPermisosModule } from './modulo-permisos/modulo-permisos.module';
import { InformesModule } from './informes/informes.module';
import { PdfModule } from './pdf/pdf.module';
import appConfig from './config/app.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig]
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    UsuariosModule,
    EmpresasModule,
    DireccionesModule,
    DepartamentosModule,
    MunicipiosModule,
    ClientesModule,
    PersonasModule,
    ContactosModule,
    EmpleadosModule,
    MarcasModule,
    ColoresModule,
    CombustiblesModule,
    VehiculosModule,
    TransmisionesModule,
    TiposVehiculoModule,
    UnidadesVehicularesModule,
    LineasModule,
    ModelosModule,
    PreciosVentaModule,
    VentasModule,
    FacturasModule,
    FelDocsModule,
    ItemsVentaModule,
    ProveedoresModule,
    ComprasModule,
    ContactosProveedorModule,
    TiposContactoModule,
    RolesModule,
    PermisosModule,
    AuthModule,
    TiposPagoModule,
    MetodosPagoModule,
    ItemsCompraModule,
    CompraDocsModule,
    ModuloPermisosModule,
    InformesModule,
    PdfModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
