import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import StatsPage from "./pages/StatsPage";
import HealthCheck from "./pages/HealthCheck";

function App() {
  return (
    <>
      {/* React Router wrapper for all routes */}
      <BrowserRouter>
        {/* Navbar */}
        <header className="p-4 bg-gray-900 text-white flex justify-between items-center shadow-lg">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-wider hover:text-blue-400 transition"
          >
            TinyLink
          </Link>

          {/* Navigation menu */}
          <nav className="space-x-4">
            {/* Link to dashboard page*/}
            <Link to="/" className="text-gray-300 hover:text-white transition">
              Dashboard
            </Link>
            {/* Link to Health Check page */}
            <Link
              to="/healthz"
              className="text-gray-300 hover:text-white transition"
            >
              Health Check
            </Link>
          </nav>
        </header>

{/* Page Routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/code/:code" element={<StatsPage />} />
          <Route path="/healthz" element={<HealthCheck />} />

          {/* Redirect Route (The core function of a URL shortener) */}
          {/* <Route path="/:code" element={<RedirectPage />} /> */}

          {/* Catch-all for 404 */}
          <Route
            path="*"
            element={
              <div className="p-6 pt-20 text-center text-xl text-red-500">
                404 - Page Not Found
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
