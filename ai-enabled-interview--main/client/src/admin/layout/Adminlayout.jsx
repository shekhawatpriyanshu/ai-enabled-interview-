import { Outlet } from "react-router-dom";
import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex relative">

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-72 transition-all duration-300 w-full overflow-x-hidden">
        
        {/* Mobile Top Bar */}
        <div className="md:hidden bg-white shadow p-4 flex items-center justify-between sticky top-0 z-30">
          <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-slate-600 hover:text-slate-900 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        <main className="p-4 md:p-6 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;