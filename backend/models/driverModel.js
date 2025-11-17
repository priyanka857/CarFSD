import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  phone: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  availability: { type: Boolean, default: true },
  rating: { type: Number, default: 5 },
});

const Driver = mongoose.model("Driver", driverSchema);
export default Driver;
