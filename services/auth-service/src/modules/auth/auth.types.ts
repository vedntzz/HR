export type UserRole = 'admin' | 'hr' | 'manager' | 'employee';

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyId: string;
  role: UserRole;
}

export interface LoginDto {
  email: string;
  password: string;
  companyId: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  companyId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  companyId: string;
}

export interface RefreshTokenRecord {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface UserProfileResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  companyId: string;
  isActive: boolean;
  createdAt: Date;
}
