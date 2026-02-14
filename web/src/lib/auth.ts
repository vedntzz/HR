interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  companyId: string;
  firstName?: string;
  lastName?: string;
  exp?: number;
}

const TOKEN_KEY = 'hrflow_token';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

export function getUser(): JwtPayload | null {
  const token = getToken();
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      removeToken();
      return null;
    }
    return payload as JwtPayload;
  } catch {
    removeToken();
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getUser() !== null;
}
