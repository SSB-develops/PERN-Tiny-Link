import { useEffect, useState } from "react";
import { getHealth } from "../../api/linkApi";

const HealthCheck = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch heath status
  const fetchHealth = async () => {
    try {
      const data = await getHealth();
      setHealth(data);
    } catch (err) {
      setHealth({ ok: false, error: "Unable to reach server" });
    }
    setLoading(false);
  };

  // Run health check on mount
  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-center">System Health Check</h1>

      <div className="bg-white shadow-lg rounded-xl p-6 border space-y-4">
        {/* Status row */}
        {!loading && (
          <div className="flex items-center gap-3">
            <div
              className={`h-4 w-4 rounded-full ${
                health?.ok ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <p className="text-lg font-medium">
              {health?.ok ? "System is Healthy" : "System Error"}
            </p>
          </div>
        )}

        {/* Loading text */}
        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* JSON Output */}
        {!loading && (
          <div>
            <h2 className="text-gray-600 text-sm mb-2">Raw Response</h2>
            <pre className="bg-gray-50 p-4 rounded-lg text-sm border overflow-auto max-h-64">
              {JSON.stringify(health, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthCheck;
