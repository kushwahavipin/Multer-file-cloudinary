// server.js
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const cors = require('cors');
const { Readable } = require('stream');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Setup Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const stream = cloudinary.uploader.upload_stream(
    { resource_type: 'auto' },
    (error, result) => {
      if (error) {
        return res.status(500).send(error.message);
      }
      res.status(200).json({ url: result.secure_url });
    }
  );

  Readable.from(req.file.buffer).pipe(stream);
});

// Endpoint to list images
app.get('/images', async (req, res) => {
  try {
    const { resources } = await cloudinary.api.resources({
      type: 'upload', // Only get uploaded resources
      resource_type: 'image'
    });

    const images = resources.map((image) => image.secure_url);
    res.status(200).json(images);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
