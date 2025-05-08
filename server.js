const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

// Create the Express app
const app = express();
app.use(cors());

// Body parser middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up static file serving (for file uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/internship', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log('Error connecting to MongoDB: ', err));

// Define the schema for the form data
const formSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  dob: String,
  address: String,
  pincode: String,
  email: String,
  phone: String,
  course: String,
  state: String,
  city: String,
  customCity: String,
  cgpa: String,
  gender: String,
  college: String,
  currentYear: String,
  graduationYear: String,
  documents: {
    noc: String,
    aadhar: String,
    collegeid: String,
    marksheets: String,
    signature: String,
    police: String
  }
});

// Create a model from the schema
const Form = mongoose.model('Form', formSchema);

// Set up multer storage for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Ensure the uploads folder exists
const fs = require('fs');
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Route to handle form submission
app.post('/submit-form', upload.fields([
  { name: 'noc' },
  { name: 'aadhar' },
  { name: 'collegeid' },
  { name: 'marksheets' },
  { name: 'signature' },
  { name: 'police' }
]), (req, res) => {
  try {
    const formData = req.body;
    const filePaths = {};

    // Loop through the files and store their paths
    for (const field in req.files) {
      if (req.files[field]) {
        filePaths[field] = req.files[field][0].path;
      }
    }

    // Create a new form document
    const newForm = new Form({
      firstName: formData.firstName,
      lastName: formData.lastName,
      dob: formData.dob,
      email: formData.email,
      phone: formData.phone,
      course: formData.course,
      pincode: formData.pincode,
      address: formData.address,
      state: formData.state,
      city: formData.city,
      customCity: formData.customCity,
      documents: filePaths,
      cgpa: formData.cgpa,
      gender: formData.gender,
      college: formData.college,
      currentYear: formData.currentYear,
      graduationYear: formData.graduationYear,
    });

    // Save the form data to MongoDB
    newForm.save()
      .then(() => res.status(200).json({ message: 'Application submitted successfully!' }))
      .catch(err => res.status(500).json({ message: 'Error saving application!', error: err }));
  } catch (err) {
    res.status(500).json({ message: 'Error processing form!', error: err });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
