import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { config } from '../../config';
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  ForbiddenError,
} from '../../errors';
import { AuthRepository } from './auth.repository';
import {
  RegisterDto,
  LoginDto,
  AuthTokens,
  JwtPayload,
  UserProfileResponse,
} from './auth.types';

const SALT_ROUNDS = 12;

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(dto: RegisterDto): Promise<{ user: UserProfileResponse; tokens: AuthTokens }> {
    const existingUser = await this.authRepository.findByEmail(dto.email, dto.companyId);

    if (existingUser) {
      throw new ConflictError('A user with this email already exists in this organization');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = await this.authRepository.create({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role,
      companyId: dto.companyId,
    });

    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    });

    return {
      user: this.toProfileResponse(user),
      tokens,
    };
  }

  async login(dto: LoginDto): Promise<{ user: UserProfileResponse; tokens: AuthTokens }> {
    const user = await this.authRepository.findByEmail(dto.email, dto.companyId);

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new ForbiddenError('Account is deactivated. Contact your administrator.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const tokens = await this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    });

    return {
      user: this.toProfileResponse(user),
      tokens,
    };
  }

  async refreshToken(token: string): Promise<AuthTokens> {
    const user = await this.authRepository.findUserByRefreshToken(token);

    if (!user) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Delete the used refresh token (rotation for security)
    await this.authRepository.deleteRefreshToken(token);

    if (!user.isActive) {
      throw new ForbiddenError('Account is deactivated. Contact your administrator.');
    }

    return this.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
      companyId: user.companyId,
    });
  }

  async getProfile(userId: string, companyId: string): Promise<UserProfileResponse> {
    const user = await this.authRepository.findById(userId, companyId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return this.toProfileResponse(user);
  }

  private async generateTokens(payload: JwtPayload): Promise<AuthTokens> {
    const accessToken = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    const refreshToken = crypto.randomBytes(64).toString('hex');
    const refreshExpiresMs = this.parseExpiresIn(config.jwt.refreshExpiresIn);

    await this.authRepository.saveRefreshToken({
      userId: payload.sub,
      token: refreshToken,
      expiresAt: new Date(Date.now() + refreshExpiresMs),
    });

    return { accessToken, refreshToken };
  }

  private parseExpiresIn(value: string): number {
    const match = value.match(/^(\d+)([smhd])$/);
    if (!match) {
      return 7 * 24 * 60 * 60 * 1000; // default 7 days
    }

    const num = parseInt(match[1], 10);
    const unit = match[2];

    const multipliers: Record<string, number> = {
      s: 1000,
      m: 60 * 1000,
      h: 60 * 60 * 1000,
      d: 24 * 60 * 60 * 1000,
    };

    return num * (multipliers[unit] ?? 7 * 24 * 60 * 60 * 1000);
  }

  private toProfileResponse(user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    companyId: string;
    isActive: boolean;
    createdAt: Date;
  }): UserProfileResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as UserProfileResponse['role'],
      companyId: user.companyId,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
