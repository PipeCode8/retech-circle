import { createContext, useContext } from "react";

export const UserContext = createContext<{ id: number } | null>(null);

export const useUser = () => useContext(UserContext);