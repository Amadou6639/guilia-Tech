import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Custom hook to access the authentication context.
 * This simplifies getting user, role, and auth functions in components.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
