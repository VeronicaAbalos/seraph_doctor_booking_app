const fs = require("fs");
const path = require("path");
const docSchema = require("../schemas/docModel");
const appointmentSchema = require("../schemas/appointmentModel");
const userSchema = require("../schemas/userModel");

// Update doctor profile
const updateDoctorProfileController = async (req, res) => {
  try {
    const doctor = await docSchema.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true }
    );
    return res.status(200).json({
      success: true,
      data: doctor,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

// Get all appointments for a doctor
const getAllDoctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await docSchema.findOne({ userId: req.user.id });
    if (!doctor) {
      return res
        .status(404)
        .json({ message: "Doctor not found", success: false });
    }
    const allAppointments = await appointmentSchema.find({
      doctorId: doctor._id,
    });
    return res.status(200).json({
      message: "Appointments fetched",
      success: true,
      data: allAppointments,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

// Handle appointment status
const handleStatusController = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    
    // Update the appointment
    const appointment = await appointmentSchema.findByIdAndUpdate(
      appointmentId,
      { status },
      { returnDocument: 'after' } // Returns the updated document
    );
    
    if (!appointment) {
      return res.status(404).json({ 
        message: "Appointment not found", 
        success: false 
      });
    }

    // Notify the patient
    const user = await userSchema.findById(appointment.userId);
    if (user) {
      user.notification.push({
        type: "appointment-status-update",
        message: `Your appointment with Dr. ${appointment.doctorInfo?.fullName} has been ${status}`,
        data: { appointmentId },
        onClickPath: "/userappointments",
      });
      await user.save();
    }

    // Return the updated appointment
    return res.status(200).json({
      message: "Appointment status updated",
      success: true,
      data: appointment, // Send back the updated appointment
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: error.message || "Something went wrong", 
      success: false 
    });
  }
};

// Download a document linked to an appointment
const documentDownloadController = async (req, res) => {
  try {
    const { appointId } = req.query;
    const appointment = await appointmentSchema.findById(appointId);
    if (!appointment) {
      return res
        .status(404)
        .json({ message: "Appointment not found", success: false });
    }

    // Ownership check: only the assigned doctor can download
    const doctor = await docSchema.findOne({ userId: req.body.userId });
    if (
      !doctor ||
      doctor._id.toString() !== appointment.doctorId.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized", success: false });
    }

    const documentUrl = appointment.document?.path;
    if (!documentUrl || typeof documentUrl !== "string") {
      return res
        .status(404)
        .json({ message: "Document URL is invalid", success: false });
    }

    const absoluteFilePath = path.join(__dirname, "..", documentUrl);
    fs.access(absoluteFilePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res
          .status(404)
          .json({ message: "File not found", success: false });
      }
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${path.basename(absoluteFilePath)}"`
      );
      res.setHeader("Content-Type", "application/octet-stream");
      const fileStream = fs.createReadStream(absoluteFilePath);
      fileStream.on("error", (error) => {
        console.error(error);
        return res
          .status(500)
          .json({ message: "Error reading the document", success: false });
      });
      fileStream.pipe(res);
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

module.exports = {
  updateDoctorProfileController,
  getAllDoctorAppointmentsController,
  handleStatusController,
  documentDownloadController,
};