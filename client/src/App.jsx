import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import BookingHistory from './pages/BookingHistory'
import Success from './pages/Success'
import Login from './pages/Login'
import Register from './pages/Register'
import { AuthProvider } from './Context/Auth'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/booking-history" element={<BookingHistory />} />
          <Route path="/success" element={<Success />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
