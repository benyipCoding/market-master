"use client";
import { getMe } from "@/app/(root)/auth/login/getMe";
import { Status } from "@/utils/apis/response";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from "react";

interface User {
  avatar: string | null;
  create_at: string;
  date_joined: string | null;
  description: string | null;
  display_name: string;
  email: string;
  first_name: string;
  gender: string | null;
  id: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login: string | null;
  last_name: string | null;
  login_error_count: number;
  mobile: string | null;
  update_at: string;
  user_type: number | null;
  username: string;
}

interface IAuthContext {
  setUserInfo: Dispatch<SetStateAction<User | null>>;
  userInfo: User | null;
}

export const AuthContext = createContext<IAuthContext>({
  setUserInfo: () => {},
  userInfo: null,
});

const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);

  useEffect(() => {
    getMe().then((res) => {
      if (!res || res.status !== Status.OK) return;
      setUserInfo(res.data);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ setUserInfo, userInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
