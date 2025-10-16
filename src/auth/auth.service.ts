import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { DataSource } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) { }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const usuario = await this.dataSource.createQueryBuilder(Usuario, 'usuario')
      .where('usuario.email = :email', { email })
      .leftJoinAndSelect('usuario.persona', 'persona')
      .leftJoinAndSelect('usuario.roles', 'roles')
      .leftJoinAndSelect('roles.permisos', 'permisos')
      .getOne();

    if (!usuario) {
      throw new UnauthorizedException('El correo electrónico o la contraseña son incorrectos');
    }

    const isPasswordCorrect = await compare(password, usuario.password);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException('El correo electrónico o la contraseña son incorrectos');
    }

    // Recopilar todos los permisos únicos
    const permisosUnicos = usuario.roles.flatMap(
      rol => rol.permisos.map(p => p.nombre)
    );

    const payload: any = {
      userId: usuario.id,
      email: usuario.email,permisos: [...new Set(permisosUnicos)]
    };

    const accessToken = this.getToken(payload);

    return { token: accessToken };
  }

  getToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: '90d',
    });
  }

}
