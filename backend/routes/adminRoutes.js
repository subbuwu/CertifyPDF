import { Router } from "express";
import { PDFDocument, rgb } from "pdf-lib";
import axios from "axios"
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

    async function getPdfTemplate() {
      try {
        const pdfUrl = 'https://drive.google.com/uc?export=download&id=1YlGzh5zRDFDLVJ9WpIWMTcIfYSpeEheI';

        const response = await axios.get(pdfUrl, { responseType: 'arraybuffer' });

        if (!response.data) {
          throw new Error('Failed to fetch PDF template');
        }

        return response.data;
      } catch (error) {
        console.error('Error fetching PDF template:', error);
        throw error;
      }
    }

    try {
      const pdfBytes = await getPdfTemplate();
      const pdfDoc = await PDFDocument.load(pdfBytes);

      const page = pdfDoc.getPages()[0];

      const pageHeight = page.getSize().height;
      const lineHeight = 30;
      const totalLines = 3;
      const totalHeight = totalLines * lineHeight;
      const startY = (pageHeight - totalHeight) / 1.6;

      page.drawText(name, {
          x: 260,
          y: startY + 2 * lineHeight,
          size: 42,
          color: rgb(255 / 255, 165 / 255, 0) ,
          font: await pdfDoc.embedFont('Helvetica-Bold'),
      });
      page.drawText(completion, {
          x: 130,
          y: startY,
          size: 16,
          color: rgb(0, 0, 0)
      });

      const modifiedPdfBytes = await pdfDoc.save();
      
      createFile(`${pdfFileName}.pdf`, "application/pdf", modifiedPdfBytes, token, email);

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
