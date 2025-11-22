import { useEffect, useState } from "react";
import { deleteLink, getAllLinks } from "../../api/linkApi";
import { Link } from "react-router-dom";
import { toIST } from "../../utils/Time";

const LinkTable = ({ refresh }) => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  //   Fetch all links
  const loadLinks = async () => {
    setLoading(true);
    const data = await getAllLinks();
    setLinks(data);
    setLoading(false);
  };

  //   Reload liks when parent trigger refresh
  useEffect(() => {
    loadLinks();
  }, [refresh]);

  // Copy short url to clipboard
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(`${import.meta.env.VITE_API_URL}/${code}`);
    alert(`Copied: ${code}`);
  };

  //   delete link
  const handleDelete = async (code) => {
    await deleteLink(code);
    loadLinks();
  };

  //   Auto refresh table every 6s to keep stats updated
  useEffect(() => {
    const interval = setInterval(() => {
      loadLinks();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Search filter (code + url)
  const filteredLinks = links.filter((l) => {
    const text = `${l.code} ${l.target_url}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <>
      {/* Search Bar */}
      <div className="mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by code or URL…"
          className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* links table */}
      <div className="overflow-x-auto overflow-y-auto shadow rounded-xl h-[200px]">
        <table className="w-full border-collapse min-w-max">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
              <th className="p-2 cursor-pointer hover:bg-gray-200 transition">
                Code
              </th>
              <th className="p-2 cursor-pointer hover:bg-gray-200 transition">
                Target URL
              </th>
              <th className="p-2 cursor-pointer hover:bg-gray-200 transition">
                Short URL
              </th>
              <th className="p-2 cursor-pointer hover:bg-gray-200 transition">
                Total Clicks
              </th>
              <th className="p-2 cursor-pointer hover:bg-gray-200 transition">
                Last Clicked Time
              </th>
              <th className="p-2 ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  <div className="flex justify-center items-center py-10">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                </td>
              </tr>
            )}
            {/* No links  */}
            {!loading && filteredLinks.length === 0 && (
              <tr>
                <td className="p-4 text-gray-500 text-center" colSpan={5}>
                  No links found. Use the form above to create one!
                </td>
              </tr>
            )}
            {/* links data */}
            {filteredLinks.map((l) => (
              <tr key={l.code} className="border-t hover:bg-gray-50 transition">
                {/* Code */}
                <td className="p-2 font-semibold">
                  <Link to={`/code/${l.code}`} className="text-blue-600">
                    {l.code}
                  </Link>
                </td>

                {/* Target url */}
                <td className="p-2 text-sm max-w-xs whitespace-nowrap overflow-hidden text-ellipsis">
                  <span title={l.target_url}>{l.target_url}</span>
                </td>

                {/* Short url */}
                <td className="p-2 text-sm font-medium">
                  <a
                    href={`${import.meta.env.VITE_API_URL}/${l.code}`}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    {import.meta.env.VITE_API_URL}/{l.code}
                  </a>
                </td>

                {/*   Total clicks */}
                <td className="p-2 text-sm font-medium">{l.total_clicks}</td>

                {/* Last clicked time */}
                <td className="p-2 text-sm text-gray-500 whitespace-nowrap">
                  {l.last_clicked ? toIST(l.last_clicked) : "—"}
                </td>

                {/* Action button */}
                <td className="p-2 flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(l.code)}
                    className="p-2 text-white rounded bg-green-500 hover:bg-green-600 transition cursor-pointer"
                    title="Copy Short URL"
                  >
                    📋
                  </button>

                  <button
                    onClick={() => handleDelete(l.code)}
                    className="p-2 text-white rounded bg-red-500 hover:bg-red-600 transition cursor-pointer"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default LinkTable;
