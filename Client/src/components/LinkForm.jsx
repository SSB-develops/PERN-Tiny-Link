import React, { useState } from "react";
import { createLinks } from "../../api/linkApi";

const LinkForm = ({ onCreated }) => {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

//   Handle form submit for creating a new short url
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation: Links must start with http/https
    if (!url.startsWith("http")) {
      setError("URL must start with http or https");
      setLoading(false);
      return;
    }

    try {
        // API call to create short link
      await createLinks({ target_url: url, code });
      setUrl("");
      setCode("");
      onCreated();
    } catch (error) {
        // Backend returns 409 for duplicate code
      if (error.response?.status === 409) {
        setError("code already exists");
      } else {
        setError("something went wrong");
      }
    }
    setLoading(false);
  };

  return (
    <>
    {/* Form card */}
      <form
        onSubmit={handleSubmit}
        className="p-2 bg-white shadow rounder-xl space-y-3"
      >
        {/* Title */}
        <h2 className="text-xl font-semibold mb-3">🔗 Add New Link</h2>

        {/* Long url input */}
        <div>
          <label className="block text-sm font-semibold mb-1">Long URL</label>
          <input
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/very-long-url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        {/* Custom code input */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Custom Code (optional)
          </label>
          <input
            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g docs123"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.toLocaleLowerCase().replace(/\s/g, ""))
            }
          />
        </div>
        {/* Error message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit button */}
        <button
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50 transition duration-150 ease-in-out cursor-pointer"
        >
          {loading ? "Creating..." : "Create Link"}
        </button>
      </form>
    </>
  );
};

export default LinkForm;
