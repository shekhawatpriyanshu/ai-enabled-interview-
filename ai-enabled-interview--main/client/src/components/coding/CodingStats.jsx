const CodingStats=({ stats })=>{
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-gray-500 font-semibold mb-2">Total Submissions</h3>
                <p className="text-3xl font-bold text-gray-800">{stats.totalSubmissions}</p>
            </div>
            
            <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-green-500">
                <h3 className="text-gray-500 font-semibold mb-2">Accepted</h3>
                <p className="text-3xl font-bold text-green-600">{stats.accepted}</p>
            </div>
            
            <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-red-500">
                <h3 className="text-gray-500 font-semibold mb-2">Wrong Attempts</h3>
                <p className="text-3xl font-bold text-red-600">{stats.wrong}</p>
            </div>
        </div>
    );
};

export default CodingStats;
