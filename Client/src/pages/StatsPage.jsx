import { useParams } from "react-router-dom";
import { getLinkStats } from "../../api/linkApi";
import { useEffect, useState } from "react";

const StatsPage = () => {
  const { code } = useParams();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch stats for the given code
  const fetchStats = async () => {
    try {
      const data = await getLinkStats(code);
      setStats(data);
    } catch (err) {
      setError("Error fetching stats");
    } finally {
      setLoading(false);
    }
  };

  // fetch data whenever the code in url changes
  useEffect(() => {
    fetchStats();
  }, [code]);

  if (loading) return( 
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>)
        
  if (error) return <p>{error}</p>;
  if (!stats) return <p>No stats found</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      {/* Title */}
      <h1 className="text-3xl font-bold text-center mb-6">
        Stats for Code: <span className="text-blue-600">{stats.code}</span>
      </h1>

      {/* Main Stats Card */}
      <div className="bg-white shadow-lg rounded-xl p-6 space-y-4 border">
        {/* Target URL section */}
        <div className="flex flex-col">
          <span className="text-gray-500 text-sm">Target URL</span>
          <a
            href={stats.target_url}
            target="_blank"
            className="text-blue-600 font-medium break-all"
          >
            {stats.target_url}
          </a>
        </div>
        {/* Clicks + Last Clicked */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border">
            <span className="text-gray-500 text-sm">Total Clicks</span>
            <p className="text-xl font-semibold">{stats.total_clicks}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border">
            <span className="text-gray-500 text-sm">Last Clicked</span>
            <p className="text-lg font-medium">
              {stats.last_clicked ? stats.last_clicked : "—"}
            </p>
          </div>
        </div>

        {/* Created date */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <span className="text-gray-500 text-sm">Created At</span>
          <p className="text-lg font-medium">{stats.created_at}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
