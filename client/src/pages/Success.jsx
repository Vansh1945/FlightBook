import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/Auth";
import { toast } from "react-toastify";
import axios from "axios";

const Success = () => {
  const { isAuthenticated, token, API } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const booking = location.state?.booking?.booking || location.state?.booking;
  const pnr = booking?.pnr;

  useEffect(() => {
    if (!booking) {
      navigate("/");
    }
  }, [booking, navigate]);

  const handleDownload = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to download ticket");
      return;
    }
    try {
      const response = await axios.get(`${API}/ticket/${pnr}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Ticket_${pnr}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Ticket downloaded successfully");
    } catch (error) {
      toast.error("Failed to download ticket");
    }
  };

  if (!booking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 pt-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600">
            Your flight booking has been successfully completed
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <div className="text-center mb-6">
            <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              PNR: {pnr}
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Booking Summary
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Airline</p>
                <p className="font-medium text-gray-800">
                  {booking.flightId?.airline || "N/A"}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Route</p>
                <p className="font-medium text-gray-800">
                  {booking.flightId?.departure_city || "N/A"} → {booking.flightId?.arrival_city || "N/A"}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Passengers</p>
                <p className="font-medium text-gray-800">
                  {booking.passengers?.length || 1} Passenger(s)
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Booking Date</p>
                <p className="font-medium text-gray-800">
                  {new Date(booking.bookedAt).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                <p className="text-xl font-bold text-green-600">
                  ₹{booking.pricePaid || "N/A"}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Confirmed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleDownload}
            disabled={!isAuthenticated}
            className={`w-full py-3 px-4 rounded-lg font-medium text-center ${
              isAuthenticated 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Download E-Ticket (PDF)
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/booking-history"
              className="block py-3 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-center"
            >
              View All Bookings
            </Link>
            
            <Link
              to="/"
              className="block py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-center"
            >
              Book Another Flight
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;