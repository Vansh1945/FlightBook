import { useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/Auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BookingModal = ({ flight, isOpen, onClose, onSuccess }) => {
  const [passengerName, setPassengerName] = useState("");
  const [loading, setLoading] = useState(false);
  const { token, API } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passengerName.trim()) {
      toast.error("Passenger name is required.");
      return;
    }
    if (!token) {
      toast.error("Authentication required. Please login again.");
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      console.log("Sending booking request to:", `${API}/bookings`);
      const response = await axios.post(`${API}/bookings`, {
        flightId: flight.id,
        passengerName: passengerName.trim(),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Booking response:", response.data);
      toast.success("Booking confirmed!");
      navigate("/success", { state: { booking: response.data.booking } });
      onSuccess();
    } catch (err) {
      console.error("Booking error:", err);
      const errorMessage = err.response?.data?.message || "Booking failed.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-800">Confirm Booking</h2>
          <p className="text-sm text-gray-600 mt-1">Complete your flight booking</p>
        </div>

        <div className="p-6">
          {/* Flight Details */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-sm text-gray-600">Airline</p>
                <p className="font-semibold text-gray-800">{flight.airline}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Flight ID</p>
                <p className="font-medium text-gray-800">{flight.flight_id}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Route</p>
                <p className="font-medium text-gray-800">
                  {flight.departure_city} → {flight.arrival_city}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Price</p>
                <p className="text-xl font-bold text-green-600">₹{flight.current_price}</p>
              </div>
            </div>
          </div>

          {/* Passenger Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passenger Full Name
              </label>
              <input
                type="text"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                placeholder="Enter passenger's name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default BookingModal;