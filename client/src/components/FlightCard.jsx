import React, { useState, useEffect } from 'react';
import { 
  FiClock, 
  FiUsers, 
  FiTrendingUp, 
  FiDollarSign,
  FiCalendar
} from 'react-icons/fi';

const FlightCard = ({ flight, onBookNow }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (flight.surge) {
      const surgeEndTime = new Date().getTime() + 300000;
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = surgeEndTime - now;
        if (distance > 0) {
          setTimeLeft(Math.floor(distance / 1000));
        } else {
          setTimeLeft(0);
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [flight.surge]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getAirlineColor = (airline) => {
    const colors = {
      'Air India': 'bg-red-100 text-red-800',
      'IndiGo': 'bg-blue-100 text-blue-800',
      'SpiceJet': 'bg-orange-100 text-orange-800',
      'Vistara': 'bg-purple-100 text-purple-800',
      'GoAir': 'bg-yellow-100 text-yellow-800'
    };
    return colors[airline] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={`bg-white rounded-xl border ${flight.surge ? 'border-red-300' : 'border-gray-200'} shadow-sm`}>
      {/* Surge Banner */}
      {flight.surge && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiTrendingUp className="w-4 h-4 text-red-600 mr-2" />
              <span className="text-red-700 font-medium text-sm">Surge Pricing Active</span>
            </div>
            <div className="flex items-center bg-red-100 px-2 py-1 rounded">
              <FiClock className="w-3 h-3 text-red-600 mr-1" />
              <span className="text-red-700 text-sm font-mono">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAirlineColor(flight.airline)}`}>
              {flight.airline}
            </div>
            <p className="text-gray-500 text-xs mt-1">Flight {flight.flight_id}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600 text-xs">Current Price</p>
            <p className={`text-xl font-bold ${flight.surge ? 'text-red-600' : 'text-green-600'}`}>
              {formatPrice(flight.current_price)}
            </p>
          </div>
        </div>

        {/* Route */}
        <div className="mb-5">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="text-lg font-semibold text-gray-800">{flight.departure_city}</p>
              <p className="text-gray-500 text-xs">Departure</p>
            </div>
            <div className="px-4 flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <div className="text-center flex-1">
              <p className="text-lg font-semibold text-gray-800">{flight.arrival_city}</p>
              <p className="text-gray-500 text-xs">Arrival</p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="border border-gray-100 rounded-lg p-3">
            <div className="flex items-center mb-1">
              <FiDollarSign className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-xs text-gray-600">Base Price</span>
            </div>
            <p className="text-gray-800 font-medium">{formatPrice(flight.base_price)}</p>
          </div>
          
          <div className="border border-gray-100 rounded-lg p-3">
            <div className="flex items-center mb-1">
              <FiUsers className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-xs text-gray-600">Seats Left</span>
            </div>
            <p className="text-gray-800 font-medium">{flight.seatsAvailable}</p>
          </div>
          
          <div className="border border-gray-100 rounded-lg p-3">
            <div className="flex items-center mb-1">
              <FiTrendingUp className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-xs text-gray-600">Surge Attempts</span>
            </div>
            <p className="text-gray-800 font-medium">{flight.surge_attempts}</p>
          </div>
          
          <div className="border border-gray-100 rounded-lg p-3">
            <div className="flex items-center mb-1">
              <FiCalendar className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-xs text-gray-600">Duration</span>
            </div>
            <p className="text-gray-800 font-medium">2h 30m</p>
          </div>
        </div>

        {/* Price Difference */}
        {flight.surge && flight.current_price > flight.base_price && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
            <div className="flex items-center">
              <FiTrendingUp className="w-4 h-4 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">
                Price increased by {Math.round(((flight.current_price - flight.base_price) / flight.base_price) * 100)}%
              </span>
            </div>
          </div>
        )}

        {/* Book Button */}
        <button
          onClick={() => onBookNow(flight)}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
            flight.surge 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors`}
        >
          {flight.surge ? 'Book Now - Surge Price' : 'Book This Flight'}
        </button>

        {/* Footer Note */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500">
            {flight.surge 
              ? 'Limited seats available at surge price'
              : 'Best price for this route'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;