import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  // ==================== LOGIN ====================
  async login(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true, name: true, role: true },
    });

    if (!user) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Email atau password salah');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      message: 'Login berhasil! Selamat datang kembali',
      access_token: this.jwt.sign(payload),
    };
  }

  // ==================== REGISTER ====================
  async register(dto: RegisterDto) {
    const { name, email, password, role } = dto;

    // 1. Cek email sudah dipakai belum
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email ini sudah terdaftar. Silakan login atau gunakan email lain.');
    }

    // 2. Hash password (dijamin aman)
    let hashedPassword: string;
    try {
      hashedPassword = await bcrypt.hash(password, 12); // 12 rounds lebih aman
    } catch (err) {
      throw new BadRequestException('Gagal mengenkripsi password. Silakan coba lagi.');
    }

    // 3. Simpan user
    let user;
    try {
      user = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role ?? 'user',
        },
        select: { id: true, email: true, name: true, role: true },
      });
    } catch (err: any) {
      if (err.code === 'P2002') {
        throw new ConflictException('Email sudah digunakan');
      }
      throw new BadRequestException('Pendaftaran gagal. Periksa data Anda dan coba lagi.');
    }

    // 4. Buat JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      message: 'Pendaftaran berhasil! Akun Anda sudah aktif.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      access_token: this.jwt.sign(payload),
    };
  }
}