import MainLayout from "../layouts/MainLayout";

const Dashboard = () => {
  return (
    <MainLayout showNavbar={true}>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Welcome back to your AI Interview Preparation Platform 🚀
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition">
          <h3 className="text-slate-500">
            Total Interviews
          </h3>

          <p className="text-4xl font-bold mt-3 text-cyan-600">
            24
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition">
          <h3 className="text-slate-500">
            Questions Solved
          </h3>

          <p className="text-4xl font-bold mt-3 text-purple-600">
            156
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition">
          <h3 className="text-slate-500">
            Achievements
          </h3>

          <p className="text-4xl font-bold mt-3 text-green-600">
            12
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition">
          <h3 className="text-slate-500">
            Rewards
          </h3>

          <p className="text-4xl font-bold mt-3 text-orange-600">
            580
          </p>
        </div>

      </div>

    </MainLayout>
  );
};

export default Dashboard;