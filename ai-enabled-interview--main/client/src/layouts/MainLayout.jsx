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
    <div className="min-h-screen bg-slate-100 flex relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 ml-0 md:ml-72 h-screen overflow-y-auto w-full transition-all duration-300">
        {showNavbar && <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}

        <motion.main
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="p-4 md:p-6 w-full overflow-x-hidden"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};

export default MainLayout;