import { Link, useLocation } from "react-router-dom";


const Sidebar = () => {
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
    <aside className="fixed left-0 top-0 w-72 h-screen bg-slate-950 border-r border-white/10 backdrop-blur-xl overflow-y-auto z-50">

      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          AI Prep
        </h1>

        <p className="text-slate-400 text-sm mt-1 font-bold">
          Interview Preparation Platform
        </p>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-2">

        {menu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
              ${
                isActive(item.path)
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
        ))}

      </nav>

      

    </aside>
  );
};

export default Sidebar;