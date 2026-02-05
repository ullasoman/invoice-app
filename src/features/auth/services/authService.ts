import api from "@/shared/api/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export function login(credentials: LoginCredentials) {
  // Backend should return: { token: string, client: object }
  return api.post("/login", credentials);
}
