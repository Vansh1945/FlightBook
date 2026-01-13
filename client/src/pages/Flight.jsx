import { useEffect, useState } from "react";
import axios from "axios";
import FlightCard from "../components/FlightCard";
import Loader from "../components/Loader";
import BookingModal from "../components/BookingModal";
import { useAuth } from "../Context/Auth";
import { useNavigate } from "react-router-dom";

export default function Flight() {
  const { API, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [sortBy, setSortBy] = useState("current_price");
  const [filterBy, setFilterBy] = useState("");

  // 🔹 Load all flights on page load
  useEffect(() => {
    fetchAllFlights();
  }, []);

  // 🔹 Fetch all flights
  const fetchAllFlights = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`${API}/flights`);
      setFlights(res.data);
    } catch (err) {
      setError("Flights load nahi ho pa rahi");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Search flights (from Searchbar)
  const handleSearch = async (from, to) => {
    if (!from || !to) return;

    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `${API}/flights/search?from=${from}&to=${to}`
      );
      setFlights(res.data);
    } catch (err) {
      setError("Search result nahi mila");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle Book Now click
  const handleBookNow = (flight) => {
    console.log("handleBookNow called with flight:", flight);
    if (!isAuthenticated) {
      console.log("User not authenticated, redirecting to login");
      navigate("/login");
      return;
    }
    console.log("Setting selectedFlight and opening modal");
    setSelectedFlight(flight);
    setIsModalOpen(true);
  };

  // 🔹 Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFlight(null);
  };

  // 🔹 Handle booking success
  const handleBookingSuccess = () => {
    closeModal();
    // Optionally refresh flights or update UI
  };

  // 🔹 Sort and filter flights
  const sortedAndFilteredFlights = flights
    .filter((flight) =>
      filterBy ? flight.airline.toLowerCase().includes(filterBy.toLowerCase()) : true
    )
    .sort((a, b) => {
      if (sortBy === "current_price") {
        return a.current_price - b.current_price;
      } else if (sortBy === "seatsAvailable") {
        return b.seatsAvailable - a.seatsAvailable;
      }
      return 0;
    });

  // 🔹 UI
  return (
    <div className="container mx-auto p-4">

      {/* Sorting and Filtering Controls */}
      <div className="mb-4 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="current_price">Price</option>
            <option value="seatsAvailable">Seats Available</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Filter by Airline:</label>
          <input
            type="text"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            placeholder="Enter airline name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Loader */}
      {loading && <Loader />}

      {/* Error */}
      {error && (
        <p className="text-red-500 text-center mt-4">{error}</p>
      )}

      {/* Flight List */}
      {!loading && sortedAndFilteredFlights.length === 0 && (
        <p className="text-center mt-6">Koi flight nahi mili ✈️</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {sortedAndFilteredFlights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} onBookNow={handleBookNow} />
        ))}
      </div>

      {/* Booking Modal */}
      {selectedFlight && (
        <BookingModal
          flight={selectedFlight}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}
