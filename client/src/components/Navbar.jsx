import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <div className="bg-white shadow p-4 flex justify-between items-center sticky top-0 z-40">
      <h1 className="text-xl font-bold">
        AI Interview Platform
      </h1>

      <button
        onClick={logout}
        className=" bg-red-500 text-white px-4 py-2 rounded border-5px  "
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar; 