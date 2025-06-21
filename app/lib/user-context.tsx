"use client";

import { createContext, useContext } from "react";

interface UserContextType {
  user: any;
  loading: boolean;
}

const UserContext = createContext<UserContextType>({ user: null, loading: false });

export function UserProvider({ children }: { children: React.ReactNode }) {
  return (
    <UserContext.Provider value={{ user: null, loading: false }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
