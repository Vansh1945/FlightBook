import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import flightRoutes from "./routes/flightRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { seedFlights } from "./utils/seedFlights.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173'].filter(Boolean),
  credentials: true
}));
app.use(express.json());

app.use("/api/flights", flightRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/ticket", pdfRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Flight Booking Backend Running 🚀");
});

// Global error handler
app.use(errorHandler);

const init = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Seed flights if collection is empty
    await seedFlights();

    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  } catch (error) {
    console.error('Server initialization error:', error);
    process.exit(1);
  }
};

init();
