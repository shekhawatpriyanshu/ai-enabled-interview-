import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";


const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menu = [
    {
      name: "Dashboard",
      path: "/",
    },
    {
      name: "Profile",
      path: "/profile",
    },


    {
      name: "Start Interview",
      path: "/interviews/start",
    },
    {
      name: "My Interviews",
      path: "/interviews",
    },
    {
      name: "Resume Analyzer",
      path: "/resume-analyzer",
    },
    {
      name: "Coding Problems",
      path: "/coding",
    },
    {
      name: "My Submissions",
      path: "/coding/submissions",
    },
    {
      name: "Question Bank",
      path: "/question-bank/questions",
    },
    {
      name: " Mock Tests",
      path: "/tests",
    },

    {
      name: "Community",
      path: "/community",
    },

    {
      name: "Contests",
      path: "/contests",
    },
    {
      name: "Analytics",
      path: "/analytics",
    },
    {
      name: "Achievements",
      path: "/achievements",
    },
    {
      name: "Rewards",
      path: "/rewards",
    },
  ];

  const isActive = (path) => {
    const matches = menu.filter((item) => {
      if (item.path === "/") {
        return location.pathname === "/";
      }
      if (item.path === "/resume-analyzer" && location.pathname.startsWith("/resume-report")) {
        return true;
      }
      return location.pathname === item.path || location.pathname.startsWith(item.path + "/");
    });

    if (matches.length === 0) return false;

    const bestMatch = matches.reduce(
      (best, current) => (current.path.length > best.path.length ? current : best),
      matches[0]
    );

    return bestMatch.path === path;
  };

  return (
    <aside className={`fixed left-0 top-0 w-72 h-screen flex flex-col bg-slate-950 border-r border-white/10 backdrop-blur-xl z-50 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>

      {/* Logo */}
      <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            AI Prep
          </h1>

          <p className="text-slate-400 text-sm mt-1 font-bold">
            Interview Preparation Platform
          </p>
        </div>
        <button 
          className="md:hidden text-slate-400 hover:text-white focus:outline-none"
          onClick={() => setIsOpen(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] p-4 space-y-2">

        {menu.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.02, duration: 0.2 }}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                ${isActive(item.path)
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
            >
              <span className="text-lg">
                {item.icon}
              </span>

              <span className="font-medium">
                {item.name}
              </span>
            </Link>
          </motion.div>
        ))}

      </nav>



    </aside>
  );
};

export default Sidebar;