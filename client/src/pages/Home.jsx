import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context/Auth";
import { toast } from "react-toastify";
import BookingModal from "../components/BookingModal";
import Loader from "../components/Loader";
import Searchbar from "../components/Searchbar";
import FlightCard from "../components/FlightCard";

const Home = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { API } = useAuth();

  // Fetch all flights on component mount
  useEffect(() => {
    fetchAllFlights();
  }, []);

  const fetchAllFlights = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/flights`);
      setFlights(response.data);
    } catch (error) {
      toast.error("Failed to fetch flights");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (flights, error) => {
    setFlights(flights);
    setLoading(false);
  };

  const handleBookClick = (flight) => {
    setSelectedFlight(flight);
    setIsBookingOpen(true);
  };

  const handleBookingClose = () => {
    setIsBookingOpen(false);
    setSelectedFlight(null);
  };

  const handleBookingSuccess = () => {
    setIsBookingOpen(false);
    setSelectedFlight(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar spacing */}
      <div className="pt-16"></div>

      {/* Hero Section */}
      <div className="bg-blue-600 text-white px-4">
        <div className="max-w-7xl mx-auto py-12">
          <h1 className="text-3xl font-bold mb-4 text-center">
            BOOK YOUR FLIGHT
          </h1>
          <p className="text-lg text-center text-blue-100">
            Search and book flights with ease
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <Searchbar onSearch={handleSearch} />
        </div>

        {/* Loading State */}
        {loading && <Loader />}

        {/* Flight List */}
        {!loading && flights.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Available Flights ({flights.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {flights.map((flight) => (
                <FlightCard 
                  key={`flight-${flight.id}`} 
                  flight={flight} 
                  onBookNow={handleBookClick} 
                />
              ))}
            </div>
          </div>
        )}

        {/* No Flights State */}
        {!loading && flights.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">✈️</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">No Flights Found</h3>
            <p className="text-gray-600 mb-6">
              Try searching with different cities or check back later
            </p>
            <button
              onClick={fetchAllFlights}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Load All Flights
            </button>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {isBookingOpen && selectedFlight && (
        <BookingModal
          flight={selectedFlight}
          isOpen={isBookingOpen}
          onClose={handleBookingClose}
          onSuccess={handleBookingSuccess}
        />
      )}

    </div>
  );
};

export default Home;