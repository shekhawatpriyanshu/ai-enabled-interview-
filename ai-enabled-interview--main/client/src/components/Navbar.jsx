import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleSidebar}
          className="md:hidden text-slate-600 hover:text-slate-900 focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-bold md:hidden">
          AI Prep
        </h1>
        <h1 className="text-xl font-bold hidden md:block">
          LeetChef
        </h1>
      </div>

      <button
        onClick={handleLogout}
        className=" bg-red-500 text-white cursor-pointer px-4 py-2 rounded border-5px  "
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar; 