// ============================================
// Auth Flow Types (matching backend models)
// ============================================

export interface JwtPayload {
  id: string;
  email: string;
  userAuthProvider: {
    provider: string;
    providerUserId: string;
  };
  iat?: number;
  exp?: number;
}

export type AuthStep = "login";
