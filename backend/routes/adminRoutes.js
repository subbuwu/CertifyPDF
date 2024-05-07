import { Router } from "express";
import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs";
import { Certificate } from "../db/Schemas.js"

const router = Router();

const createFile = async (fileName, mimeType, content,token,email) => {

    try {
      const fileMetadata = {
        name: fileName,
        mimeType: mimeType
      };
  
      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(fileMetadata)], { type: 'application/json' }));
      formData.append('file', new Blob([content], { type: mimeType }));
  
      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
  
      if (response.ok) {
        const file = await response.json();

        const driveLinkId = `https://drive.google.com/file/d/${file.id}/view`

        const newCertificate = new Certificate({
          email : email,
          driveFileId : driveLinkId
        })

        await newCertificate.save();

        console.log('File uploaded:', file);
      } else {
        throw new Error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  

router.post("/upload", async (req, res) => {
    const { name, completionDate, courseName, token , pdfFileName, email} = req.body;
    const completion = `For successfully completing the ${courseName} course on ${completionDate}.`
    
    try {
        // Load the existing PDF document
        const existingPdfBytes = fs.readFileSync("../docs/TDC.pdf");
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
            x: 260,
            y: startY + 2 * lineHeight, // Adjust based on the line number and spacing
            size: 42,
            color: rgb(255 / 255, 165 / 255, 0) ,
            font: await pdfDoc.embedFont('Helvetica-Bold'),
        });
        page.drawText(completion, {
            x: 130,
            y: startY, // Adjust based on the line number and spacing
            size: 16,
            color: rgb(0, 0, 0)
        });

        // Save the modified PDF document to a new file
        const modifiedPdfBytes = await pdfDoc.save();
        // fs.writeFileSync(`${pdfFileName}+.pdf`, modifiedPdfBytes);
        
        createFile(`${pdfFileName}.pdf`, "application/pdf", modifiedPdfBytes,token,email);

        // Respond with a success message or send the modified PDF file
        res.json({ message: "PDF saved successfully" });
    } catch (error) {
        console.error("Error filling PDF form:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/getLinks",async (req,res) => {
  const certificates = await Certificate.find();
  res.send(certificates)
})

export default router;
