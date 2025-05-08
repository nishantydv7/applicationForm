const mongoose = require("mongoose");

const formDataSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: String, required: true },

  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  address: { type: String, required: true },
  college: { type: String, required: true },
  course: { type: String, required: true },
  customCourse: { type: String, default: "" },
  currentYear: { type: String, required: true },
  graduationYear: { type: String, required: true },
  cgpa: { type: String, required: true },
  phone: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  customCity: { type: String, default: "" },
  pincode: { type: String, required: true },
  email: { type: String, required: true },

  noc: { type: String, default: "" },
  aadhar: { type: String, default: "" },
  collegeid: { type: String, default: "" },
  marksheets: [{ type: String }],
  signature: { type: String, default: "" },
  police: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("FormData", formDataSchema);
