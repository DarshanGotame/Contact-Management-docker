"use client";
import { useState, createContext, useContext } from "react";
import AdminFooter from "@/components/admin/AdminFooter";
import AdminNavBar from "@/components/admin/AdminNavbar";
import AdminProvider from "@/providers/AdminProvider";
import AuthProvider from "@/providers/AuthProvider";

interface AdminLayoutContextType {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextType | null>(null);

export const useAdminLayout = () => {
  const context = useContext(AdminLayoutContext);
  if (!context) {
    throw new Error('useAdminLayout must be used within AdminLayout');
  }
  return context;
};

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <AdminProvider allowedRoles={["admin"]}>
        <AdminLayoutContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
          <div className="flex min-h-screen relative max-h-screen overflow-y-hidden">
            <div className="flex-1 flex flex-col overflow-auto">
              <AdminNavBar 
                onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
                showSidebarToggle={true}
              />
              <main className="flex-1">
                {children}
              </main>
              <AdminFooter />
            </div>
          </div>
        </AdminLayoutContext.Provider>
      </AdminProvider>
    </AuthProvider>
  );
};

export default AdminLayout;
