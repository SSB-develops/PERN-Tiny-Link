import { useState } from "react";
import LinkForm from "../components/LinkForm";
import LinkTable from "../components/LinkTable";

const Dashboard = () => {
  const [refresh, setRefresh] = useState(false);

  const handleCreated = () => setRefresh((prev) => !prev);
  return (
    <div className="p-6 space-y-6">
      {/* Page title */}
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {/* components */}
      <LinkForm onCreated={handleCreated} />
      <LinkTable refresh={refresh} />
    </div>
  );
};

export default Dashboard;
