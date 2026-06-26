import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = ({
  children,
  showNavbar = false,
}) => {
  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <div className="ml-72 h-screen overflow-y-auto">
        {showNavbar && <Navbar />}

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;