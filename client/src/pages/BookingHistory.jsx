import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context/Auth";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import {
  FiCalendar,
  FiDownload,
  FiMapPin,
  FiSend,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiBriefcase
} from "react-icons/fi";
import { TbPlaneDeparture, TbPlaneArrival } from "react-icons/tb";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token, isAuthenticated, API } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchBookings();
    } else {
      toast.error("Please login to view your bookings");
    }
  }, [isAuthenticated]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to fetch bookings.";
      setError(errorMessage);
      toast.error(errorMessage);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (pnr) => {
    try {
      const response = await axios.get(`${API}/ticket/${pnr}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket_${pnr}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Ticket downloaded successfully!");
    } catch (err) {
      toast.error("Failed to download ticket");
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
      {/* Navbar spacing */}
      <div className="pt-16"></div>
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Your Bookings</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Manage and download all your flight bookings in one place
            </p>
            <div className="mt-6 flex items-center justify-center space-x-4 text-blue-100">
              <FiCalendar className="w-6 h-6" />
              <span>Total Bookings: {bookings.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 -mt-8">

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Booking History</h2>
            <p className="text-gray-600">View and manage all your flight reservations</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="py-20">
              <Loader />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBriefcase className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load Bookings</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
              <button
                onClick={fetchBookings}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* No Bookings State */}
          {!loading && !error && bookings.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiBriefcase className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">No Bookings Yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You haven't made any flight bookings yet. Start your journey by booking your first flight!
              </p>
              <button className="px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200">
                Book a Flight
              </button>
            </div>
          )}

          {/* Bookings List */}
          {!loading && !error && bookings.length > 0 && (
            <div className="divide-y divide-gray-100">
              {bookings.map((booking) => (
                <div key={booking.pnr} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    {/* Left Section - Flight Info */}
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className="hidden md:block">
                          <div className="p-3 bg-blue-50 rounded-xl">
                            <FiBriefcase className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mr-3">
                              PNR: {booking.pnr}
                            </span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status || 'Confirmed'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center">
                              <TbPlaneDeparture className="w-5 h-5 text-gray-400 mr-3" />
                              <div>
                                <p className="text-sm text-gray-600">Flight ID</p>
                                <p className="font-semibold">{booking.flight_id}</p>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <TbPlaneArrival className="w-5 h-5 text-gray-400 mr-3" />
                              <div>
                                <p className="text-sm text-gray-600">Airline</p>
                                <p className="font-semibold">{booking.airline}</p>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <FiCalendar className="w-5 h-5 text-gray-400 mr-3" />
                              <div>
                                <p className="text-sm text-gray-600">Date</p>
                                <p className="font-semibold">
                                  {new Date(booking.booking_date_time).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-6 mb-2">
                            <div className="flex items-center">
                              <FiMapPin className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-600">{booking.route}</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-6">
                            <div className="flex items-center">
                              <FiUser className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-600">Passenger: {booking.passengerName}</span>
                            </div>
                            <div className="flex items-center">
                              <FiDollarSign className="w-4 h-4 text-gray-400 mr-2" />
                              <span className="text-lg font-bold text-green-600">₹{booking.final_price}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="mt-4 lg:mt-0 lg:ml-6">
                      <button
                        onClick={() => handleDownload(booking.pnr)}
                        className="w-full lg:w-auto flex items-center justify-center px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        <FiDownload className="w-5 h-5 mr-2" />
                        Download Ticket
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default BookingHistory;