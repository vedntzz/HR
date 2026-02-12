// Simplified mock JWT for MVP - no actual JWT library needed

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  companyId: string;
}

// Generate a simple mock token
export const generateToken = (payload: JwtPayload): string => {
  // Return a simple base64 encoded JSON for demo purposes
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

// Verify and decode the mock token
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    return decoded as JwtPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
