import { Router } from "express";
import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs";
import { google } from "googleapis";
import bodyParser from "body-parser";
const credentials = {"web":{"client_id":"170723303875-r24dvnnk53gjsnbev6hrivv7pg2eko06.apps.googleusercontent.com","project_id":"tough-cider-422517-d0","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"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"}}

const router = Router();

router.use(bodyParser.json());

const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret);

// Scope required for Google Drive API
const SCOPES = ['https://www.googleapis.com/auth/drive'];

async function uploadFileToDrive(auth, file) {
    const drive = google.drive({ version: 'v3', auth });

    const fileMetadata = {
      name: 'edited_file.pdf', // Name for the uploaded file
    };
    
    const media = {
      mimeType: 'application/pdf',
      body: fs.createReadStream(file.path),
    };
    const res = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
    });
    return res.data.id;
  }


router.post("/upload", async (req, res) => {
    
    const { name, completionDate, courseName,token } = req.body;

    oAuth2Client.setCredentials(token);

    const completion = `For successfully completing the ${courseName} course on ${completionDate}.`;

    try {
        // Load the existing PDF document
        const existingPdfBytes = fs.readFileSync("/Users/subbu/Desktop/Projects/CertifyPDF/backend/docs/TDC.pdf");
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        // Get the first page of the document
        const page = pdfDoc.getPages()[0];

        const pageHeight = page.getSize().height;
        const lineHeight = 30; // Adjust as needed for spacing between lines

        // Calculate vertical position for each line of text
        const totalLines = 3; // Adjust based on the number of lines of text
        const totalHeight = totalLines * lineHeight;
        const startY = (pageHeight - totalHeight) / 1.6;

        // Fill in form fields with provided data
        page.drawText(name, {
            x: 330,
            y: startY + 2 * lineHeight,
            size: 42,
            color: rgb(255 / 255, 165 / 255, 0),
            font: await pdfDoc.embedFont("Helvetica-Bold"),
        });
        page.drawText(completion, {
            x: 130,
            y: startY,
            size: 16,
            color: rgb(0, 0, 0),
        });

        // Save the modified PDF document to a new file
        const modifiedPdfBytes = await pdfDoc.save();
        const filePath = "to_be_saved_to_google_drive_linktodatabase.pdf";
        fs.writeFileSync(filePath, modifiedPdfBytes);

        // Upload the file to Google Drive
        const fileId = await uploadFileToDrive(oAuth2Client, filePath);

        // Now you can store the fileId in your database or respond with it
        res.json({ message: "PDF saved to Google Drive successfully", fileId });
    } catch (error) {
        console.error("Error filling PDF form:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
