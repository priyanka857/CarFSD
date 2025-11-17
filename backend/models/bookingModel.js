import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingType: {
      type: String,
      enum: ["Car", "Driver"],
      required: true,
    },
    pickupLocation: { type: String, required: true },
    dropLocation: {
      type: String,
      required: function () {
        return this.bookingType === "Car";
      },
    },
    bookingDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true },

    // Car Booking Fields
    vehicleType: {
      type: String,
      required: function () {
        return this.bookingType === "Car";
      },
    },

    // Driver Booking Fields
    experience: {
      type: Number,
      required: function () {
        return this.bookingType === "Driver";
      },
    },
    licenseType: {
      type: String,
      required: function () {
        return this.bookingType === "Driver";
      },
    },
    rating: {
      type: String,
      required: function () {
        return this.bookingType === "Driver";
      },
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
