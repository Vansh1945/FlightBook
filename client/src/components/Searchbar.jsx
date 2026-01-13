import { useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/Auth";
import { toast } from "react-toastify";
import { FiSearch, FiMapPin, FiNavigation } from "react-icons/fi";

const Searchbar = ({ onSearch }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const { token, API } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!from.trim() || !to.trim()) {
      toast.error("Please fill in both departure and arrival cities.");
      return;
    }
    if (from.trim().toLowerCase() === to.trim().toLowerCase()) {
      toast.error("Departure and arrival cities cannot be the same.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `${API}/flights/search?from=${encodeURIComponent(from.trim())}&to=${encodeURIComponent(to.trim())}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onSearch(response.data, false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch flights.";
      toast.error(errorMessage);
      onSearch([], false);
    } finally {
      setLoading(false);
    }
  };

  const swapCities = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row items-end gap-4">
          {/* Departure City */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departure City
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMapPin className="h-5 w-5 text-blue-500" />
              </div>
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="e.g., New Delhi"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex items-center justify-center">
            <button
              type="button"
              onClick={swapCities}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg"
              aria-label="Swap departure and arrival"
            >
              <FiNavigation className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Arrival City */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arrival City
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMapPin className="h-5 w-5 text-green-500" />
              </div>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="e.g., Mumbai"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="w-full lg:w-auto">
            <button
              type="submit"
              disabled={loading || !from.trim() || !to.trim()}
              className="w-full lg:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                  Searching...
                </>
              ) : (
                <>
                  <FiSearch className="w-4 h-4 mr-2" />
                  Search Flights
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Searchbar;