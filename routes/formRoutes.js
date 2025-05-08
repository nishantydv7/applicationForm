const express = require('express');
const multer = require('multer');
const path = require('path');
const FormData = require('../models/FormData');
const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, unique + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/submit', upload.fields([
  { name: 'noc' },
  { name: 'marksheets' },
  { name: 'aadhar' },          // fixed from "adhar"
  { name: 'collegeid' },
  { name: 'signature' },       // include missing signature field
  { name: 'police' }
]), async (req, res) => {
  try {
    const files = req.files;
    const data = req.body;

    const formData = new FormData({
      firstName: data.firstName,
      lastName: data.lastName,
      dob:data.dob,
      gender: data.gender,
      address: data.address,
      college: data.college,
      course: data.course,
      customCourse: data.course === "Other" ? data.customCourse : "",
      currentYear: data.currentYear,
      graduationYear: data.graduationYear,
      cgpa: data.cgpa,
      phone: data.phone,
      state: data.state,
      city: data.city,
      customCity: data.city === "Other" ? data.customCity : "",
      pincode: data.pincode,
      email: data.email,
      noc: files?.noc?.[0]?.path || '',
      aadhar: files?.aadhar?.[0]?.path || '',
      collegeid: files?.collegeid?.[0]?.path || '',
      marksheets: files?.marksheets ? files.marksheets.map(file => file.path) : [],
      signature: files?.signature?.[0]?.path || '',
      police: files?.police?.[0]?.path || ''
    });

    await formData.save();

    res.json({ success: true, message: "Application submitted successfully!" });
  } catch (err) {
    console.error("❌ Error saving application:", err);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
});

module.exports = router;
