// src/features/auth/hooks/useAuth.ts
import { useState } from "react";
import { saveAuth, clearAuth, isAuthed, getClient } from "@/shared/api/token";
import * as authService from "../services/authService";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState(getClient());

  // login
  const login = async (
    credentials: { email: string; password: string },
    remember = true
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      const { token, client } = response.data; // {token, client} from backend

      saveAuth(token, client, remember);
      setClient(client);

      return client;
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // logout
  const logout = () => {
    clearAuth();
    setClient(null);
    window.location.href = "/"; // back to login root page
  };

  return {
    client,
    loading,
    error,
    login,
    logout,
    isAuthed: isAuthed(),
  };
}
