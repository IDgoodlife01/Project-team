import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { api } from "../AxiosApi.js";

const AuthContext = createContext(undefined);

// localStorage 저장 헬퍼
// AxiosApi 인터셉터가 "token" 키를 읽으므로 반드시 함께 저장
function persistUser(publicUser) {
  localStorage.setItem("petapp_user", JSON.stringify(publicUser));
  localStorage.setItem("token", publicUser.token);
  localStorage.setItem("nickname", publicUser.nickname ?? "");
  localStorage.setItem("role", publicUser.role ?? "user");
  localStorage.setItem("userId", String(publicUser.id ?? ""));
}

function clearUser() {
  ["petapp_user", "token", "nickname", "role", "userId"].forEach((k) =>
    localStorage.removeItem(k),
  );
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("petapp_user");
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  // 탭 간 로그아웃 동기화
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "petapp_user" && !e.newValue) {
        setUser(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      // api.auth.login → { token, role, nickname, userId }
      const data = await api.auth.login(email, password);

      const publicUser = {
        id: data.userId,
        email,
        nickname: data.nickname,
        role: (data.role ?? "user").toLowerCase(),
        token: data.token,
      };

      persistUser(publicUser);
      setUser(publicUser);
      return true;
    } catch (err) {
      console.error("login error:", err);
      return false;
    }
  }, []);

  const signup = useCallback(
    async (email, password, nickname, phone, role = "USER") => {
      try {
        await api.auth.signup({
          email,
          password,
          nickname,
          phone,
          role: role.toUpperCase(),
        });
        return await login(email, password);
      } catch (err) {
        console.error("signup error:", err);
        return false;
      }
    },
    [login],
  );

  // OAuth 등 외부 로그인
  const loginWithOAuth = useCallback((userData) => {
    persistUser(userData);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    clearUser();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      login,
      signup,
      loginWithOAuth,
      logout,
      isAuthenticated: !!user,
      isAdmin:
        user?.role === "admin" ||
        user?.role === "ADMIN" ||
        user?.role === "ROLE_ADMIN",
    }),
    [user, login, signup, loginWithOAuth, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
