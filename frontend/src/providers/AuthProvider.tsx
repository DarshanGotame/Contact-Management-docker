"use client";
import { User } from "@/types";
import { deleteLoggedInUser, getLoggedInUser } from "@/utils/storageHelper";
import { getUserAvatarUrl } from "@/utils/imageHelper";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const localUser = getLoggedInUser();

        if (localUser) {
          // Ensure avatar URL is properly formatted
          const processedUser = {
            ...localUser,
            avatar: getUserAvatarUrl(localUser)
          };
          setUser(processedUser);
        } else {
          throw new Error("User not found");
        }
      } catch {
        deleteLoggedInUser();
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="w-screen overflow-hidden flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (user) {
    return (
      <AuthContext.Provider
        value={{
          user,
          isAuthenticated: !!user,
          loading,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
