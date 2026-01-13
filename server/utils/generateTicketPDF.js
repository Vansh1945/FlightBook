import PDFDocument from 'pdfkit';
import fs from 'fs';

const generateTicketPDF = (pnr, passengerName, flight, currentPrice, totalPrice, bookedAt, pdfPath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });

      const stream = fs.createWriteStream(pdfPath);
      doc.pipe(stream);

      let yPosition = 50;

      // HEADER WITH BACKGROUND BANNER
      doc.rect(0, 0, 595.28, 120).fill('#1e40af'); // Blue banner
      
      // Title
      doc.fontSize(28).font('Helvetica-Bold')
        .fillColor('#ffffff')
        .text('E-TICKET CONFIRMATION', { align: 'center', y: 60 });
      
      // Subtitle
      doc.fontSize(14).font('Helvetica')
        .fillColor('#dbeafe')
        .text('SkyJet Airways', { align: 'center', y: 100 });
      
      doc.fillColor('#000000');
      yPosition = 140;

      // MAIN TICKET CARD
      // Card background with border
      doc.roundedRect(50, yPosition, 495, 120, 10)
        .fill('#f8fafc') 
        .stroke('#cbd5e1'); 

      // Ticket Header inside card
      doc.fontSize(12).font('Helvetica')
        .fillColor('#64748b')
        .text('E-TICKET', 70, yPosition + 20);
      
      doc.fontSize(20).font('Helvetica-Bold')
        .fillColor('#1e40af')
        .text(`PNR: ${pnr}`, 70, yPosition + 40);

      // Flight details in two columns
      const col1X = 70;
      const col2X = 300;
      
      doc.fontSize(10).font('Helvetica')
        .fillColor('#64748b')
        .text('AIRLINE', col1X, yPosition + 75);
      doc.fontSize(12).font('Helvetica-Bold')
        .fillColor('#000000')
        .text(flight.airline, col1X, yPosition + 90);

      doc.fontSize(10).font('Helvetica')
        .fillColor('#64748b')
        .text('FLIGHT NO.', col2X, yPosition + 75);
      doc.fontSize(12).font('Helvetica-Bold')
        .fillColor('#000000')
        .text(flight.flight_id, col2X, yPosition + 90);

      // Route with arrow
      yPosition += 130;
      doc.fontSize(10).font('Helvetica')
        .fillColor('#64748b')
        .text('ROUTE', 70, yPosition);
      
      doc.fontSize(16).font('Helvetica-Bold')
        .fillColor('#000000')
        .text(flight.departure_city, 70, yPosition + 15);
      
      doc.fontSize(12).font('Helvetica')
        .fillColor('#1e40af')
        .text('→', 180, yPosition + 18);
      
      doc.fontSize(16).font('Helvetica-Bold')
        .fillColor('#000000')
        .text(flight.arrival_city, 200, yPosition + 15);

      yPosition += 50;

      // PASSENGER DETAILS SECTION
      doc.fontSize(16).font('Helvetica-Bold')
        .fillColor('#1e40af')
        .text('PASSENGER DETAILS', 50, yPosition);
      
      // Decorative line
      doc.moveTo(50, yPosition + 20).lineTo(200, yPosition + 20)
        .lineWidth(2).stroke('#1e40af');
      
      yPosition += 40;

      doc.fontSize(12).font('Helvetica')
        .fillColor('#475569')
        .text('Passenger Name:', 50, yPosition);
      
      doc.fontSize(14).font('Helvetica-Bold')
        .fillColor('#000000')
        .text(passengerName, 180, yPosition - 2);
      
      yPosition += 25;

      doc.fontSize(12).font('Helvetica')
        .fillColor('#475569')
        .text('Booking Date:', 50, yPosition);
      
      doc.fontSize(12).font('Helvetica')
        .fillColor('#000000')
        .text(bookedAt.toLocaleString(), 180, yPosition);
      
      yPosition += 40;

      // PAYMENT DETAILS SECTION
      doc.fontSize(16).font('Helvetica-Bold')
        .fillColor('#1e40af')
        .text('PAYMENT DETAILS', 50, yPosition);
      
      doc.moveTo(50, yPosition + 20).lineTo(200, yPosition + 20)
        .lineWidth(2).stroke('#1e40af');
      
      yPosition += 40;

      // Price comparison table
      const tableY = yPosition;
      
      // Table header
      doc.rect(50, tableY, 495, 25).fill('#e2e8f0');
      doc.fontSize(11).font('Helvetica-Bold')
        .fillColor('#1e293b')
        .text('Description', 60, tableY + 8);
      doc.text('Amount', 400, tableY + 8);
      
      // Table rows
      doc.rect(50, tableY + 25, 495, 25).fill('#ffffff');
      doc.fontSize(11).font('Helvetica')
        .fillColor('#475569')
        .text('Base Fare', 60, tableY + 33);
      doc.text(`₹${currentPrice}`, 400, tableY + 33);
      
      doc.rect(50, tableY + 50, 495, 25).fill('#f8fafc');
      doc.fontSize(11).font('Helvetica')
        .fillColor('#475569')
        .text('Payment Method', 60, tableY + 58);
      doc.text('Wallet', 400, tableY + 58);
      
      doc.rect(50, tableY + 75, 495, 35).fill('#dbeafe');
      doc.fontSize(14).font('Helvetica-Bold')
        .fillColor('#1e40af')
        .text('Total Amount Paid', 60, tableY + 85);
      doc.fontSize(16).font('Helvetica-Bold')
        .fillColor('#059669')
        .text(`₹${totalPrice}`, 400, tableY + 83);
      
      yPosition = tableY + 120;

      // IMPORTANT INFORMATION
      doc.fontSize(12).font('Helvetica-Bold')
        .fillColor('#dc2626')
        .text('IMPORTANT INFORMATION:', 50, yPosition);
      
      yPosition += 20;
      
      const instructions = [
        '• Please arrive at the airport 3 hours before departure',
        '• Carry a valid government photo ID',
        '• E-ticket copy must be presented at check-in',
        '• Check-in opens 48 hours before departure',
        '• For any changes, contact customer support'
      ];
      
      instructions.forEach((instruction, index) => {
        doc.fontSize(10).font('Helvetica')
          .fillColor('#4b5563')
          .text(instruction, 60, yPosition + (index * 15));
      });

      yPosition += 90;

      // FOOTER
      doc.rect(0, yPosition, 595.28, 60).fill('#1e293b');
      
      doc.fontSize(10).font('Helvetica')
        .fillColor('#94a3b8')
        .text('Thank you for choosing SkyJet Airways', { align: 'center', y: yPosition + 20 });
      
      doc.fontSize(9).font('Helvetica')
        .fillColor('#64748b')
        .text('For assistance: support@skyjet.com | Call: 1800-123-4567', 
              { align: 'center', y: yPosition + 40 });

      doc.end();

      stream.on('finish', () => resolve());
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

export { generateTicketPDF };