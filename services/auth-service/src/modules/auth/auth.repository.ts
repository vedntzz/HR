import { Pool } from 'pg';
import { UserRecord, RefreshTokenRecord } from './auth.types';

interface CreateUserData {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: string;
  companyId: string;
}

interface CreateRefreshTokenData {
  userId: string;
  token: string;
  expiresAt: Date;
}

export class AuthRepository {
  constructor(private readonly db: Pool) {}

  async findByEmail(email: string, companyId: string): Promise<UserRecord | null> {
    const query = `
      SELECT id, email, password_hash, first_name, last_name,
             role, company_id, is_active, created_at, updated_at
      FROM users
      WHERE email = $1 AND company_id = $2
    `;
    const result = await this.db.query(query, [email, companyId]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToUser(result.rows[0]);
  }

  async findById(id: string, companyId: string): Promise<UserRecord | null> {
    const query = `
      SELECT id, email, password_hash, first_name, last_name,
             role, company_id, is_active, created_at, updated_at
      FROM users
      WHERE id = $1 AND company_id = $2
    `;
    const result = await this.db.query(query, [id, companyId]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToUser(result.rows[0]);
  }

  async create(data: CreateUserData): Promise<UserRecord> {
    const query = `
      INSERT INTO users (email, password_hash, first_name, last_name, role, company_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, password_hash, first_name, last_name,
                role, company_id, is_active, created_at, updated_at
    `;
    const values = [
      data.email,
      data.passwordHash,
      data.firstName,
      data.lastName,
      data.role,
      data.companyId,
    ];
    const result = await this.db.query(query, values);
    return this.mapRowToUser(result.rows[0]);
  }

  async saveRefreshToken(data: CreateRefreshTokenData): Promise<RefreshTokenRecord> {
    const query = `
      INSERT INTO refresh_tokens (user_id, token, expires_at)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, token, expires_at, created_at
    `;
    const result = await this.db.query(query, [
      data.userId,
      data.token,
      data.expiresAt,
    ]);
    return this.mapRowToRefreshToken(result.rows[0]);
  }

  async findRefreshToken(token: string): Promise<RefreshTokenRecord | null> {
    const query = `
      SELECT rt.id, rt.user_id, rt.token, rt.expires_at, rt.created_at
      FROM refresh_tokens rt
      INNER JOIN users u ON u.id = rt.user_id
      WHERE rt.token = $1 AND rt.expires_at > NOW() AND u.is_active = true
    `;
    const result = await this.db.query(query, [token]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToRefreshToken(result.rows[0]);
  }

  async findUserByRefreshToken(token: string): Promise<UserRecord | null> {
    const query = `
      SELECT u.id, u.email, u.password_hash, u.first_name, u.last_name,
             u.role, u.company_id, u.is_active, u.created_at, u.updated_at
      FROM users u
      INNER JOIN refresh_tokens rt ON rt.user_id = u.id
      WHERE rt.token = $1 AND rt.expires_at > NOW() AND u.is_active = true
    `;
    const result = await this.db.query(query, [token]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToUser(result.rows[0]);
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await this.db.query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
  }

  async deleteAllUserRefreshTokens(userId: string): Promise<void> {
    await this.db.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
  }

  private mapRowToUser(row: Record<string, unknown>): UserRecord {
    return {
      id: row.id as string,
      email: row.email as string,
      passwordHash: row.password_hash as string,
      firstName: row.first_name as string,
      lastName: row.last_name as string,
      role: row.role as UserRecord['role'],
      companyId: row.company_id as string,
      isActive: row.is_active as boolean,
      createdAt: row.created_at as Date,
      updatedAt: row.updated_at as Date,
    };
  }

  private mapRowToRefreshToken(row: Record<string, unknown>): RefreshTokenRecord {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      token: row.token as string,
      expiresAt: row.expires_at as Date,
      createdAt: row.created_at as Date,
    };
  }
}
