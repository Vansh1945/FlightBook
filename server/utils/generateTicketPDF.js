import PDFDocument from 'pdfkit';
import fs from 'fs';

const generateTicketPDF = (pnr, passengerName, flight, totalPrice, bookedAt, pdfPath) => {
  return new Promise((resolve, reject) => {
    try {
      // A4 size: 595.28 x 841.89 points
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });

      // Pipe to file
      const stream = fs.createWriteStream(pdfPath);
      doc.pipe(stream);

      // White background (default)
      doc.fillColor('#000000');

      let yPosition = 50;

      // HEADER SECTION
      doc.fontSize(28).font('Helvetica-Bold').text('FLIGHT TICKET', { align: 'center' });
      yPosition += 40;

      // Airplane icon (text-based)
      doc.fontSize(20).text('✈', { align: 'center' });
      yPosition += 30;

      // Horizontal divider
      doc.moveTo(50, yPosition).lineTo(545, yPosition).stroke();
      yPosition += 30;

      // PASSENGER DETAILS SECTION
      doc.fontSize(16).font('Helvetica-Bold').text('Passenger Details', 50, yPosition);
      yPosition += 25;

      doc.fontSize(12).font('Helvetica');
      doc.text('Passenger Name', 50, yPosition);
      doc.font('Helvetica-Bold').text(`: ${passengerName}`, 200, yPosition);
      yPosition += 20;

      // FLIGHT DETAILS SECTION
      yPosition += 20;
      doc.fontSize(16).font('Helvetica-Bold').text('Flight Details', 50, yPosition);
      yPosition += 25;

      doc.fontSize(12).font('Helvetica');
      doc.text('Airline Name', 50, yPosition);
      doc.text(`: ${flight.airline}`, 200, yPosition);
      yPosition += 20;

      doc.text('Flight ID', 50, yPosition);
      doc.text(`: ${flight.flight_id}`, 200, yPosition);
      yPosition += 20;

      doc.text('Route', 50, yPosition);
      doc.text(`: ${flight.departure_city} , ${flight.arrival_city}`, 200, yPosition);
      yPosition += 30;

      // PAYMENT DETAILS SECTION
      doc.fontSize(16).font('Helvetica-Bold').text('Payment Details', 50, yPosition);
      yPosition += 25;

      doc.fontSize(12).font('Helvetica');
      doc.text('Final Price Paid', 50, yPosition);
      doc.font('Helvetica-Bold').fillColor('#1e40af').text(`: ₹${totalPrice}`, 200, yPosition);
      doc.fillColor('#000000');
      yPosition += 20;

      doc.text('Payment Method', 50, yPosition);
      doc.text(': Wallet', 200, yPosition);
      yPosition += 30;

      // BOOKING INFORMATION SECTION
      doc.fontSize(16).font('Helvetica-Bold').text('Booking Information', 50, yPosition);
      yPosition += 25;

      doc.fontSize(12).font('Helvetica');
      doc.text('Booking Date & Time', 50, yPosition);
      doc.text(`: ${bookedAt.toLocaleString()}`, 200, yPosition);
      yPosition += 20;

      doc.text('PNR Number', 50, yPosition);
      doc.font('Helvetica-Bold').text(`: ${pnr}`, 200, yPosition);
      yPosition += 40;

      // FOOTER SECTION
      // Horizontal divider
      doc.moveTo(50, yPosition).lineTo(545, yPosition).stroke();
      yPosition += 20;

      doc.fontSize(12).font('Helvetica-Bold').text('Thank you for booking with XTechon Flights ✈', { align: 'center' });
      yPosition += 20;

      doc.fontSize(8).font('Helvetica').fillColor('#6b7280').text('This is an electronic ticket. Please carry a valid ID proof for check-in.', { align: 'center' });

      doc.end();

      stream.on('finish', () => resolve());
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

export { generateTicketPDF };
