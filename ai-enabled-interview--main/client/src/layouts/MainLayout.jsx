import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { motion } from "framer-motion";
import { useState } from "react";

const MainLayout = ({
  children,
  showNavbar = false,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex relative">
      {/* Mobile Sidebar Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 ml-0 md:ml-72 h-screen overflow-y-auto w-full transition-all duration-300 flex flex-col bg-slate-50">
        {showNavbar && <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}

        <motion.main
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="p-4 md:p-6 w-full flex-1 overflow-x-hidden bg-slate-50"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default MainLayout;