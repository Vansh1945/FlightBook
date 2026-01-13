import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Download ticket PDF
const downloadTicketPDF = async (req, res) => {
  try {
    const { pnr } = req.params;
    const pdfPath = path.join(__dirname, '..', 'tickets', `Ticket_${pnr}.pdf`);
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
    res.download(pdfPath, `Ticket_${pnr}.pdf`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { downloadTicketPDF };
