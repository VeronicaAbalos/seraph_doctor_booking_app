const docSchema = require("../schemas/docModel");
const userSchema = require("../schemas/userModel");
const appointmentSchema = require("../schemas/appointmentModel");

// Get all users
const getAllUsersControllers = async (req, res) => {
  try {
    const users = await userSchema.find({}).select("-password");
    return res
      .status(200)
      .json({ message: "Users fetched", success: true, data: users });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

// Get all doctors
const getAllDoctorsControllers = async (req, res) => {
  try {
    const doctors = await docSchema.find({});
    return res
      .status(200)
      .json({ message: "Doctors fetched", success: true, data: doctors });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

// Approve a doctor
const getStatusApproveController = async (req, res) => {
  try {
    const { doctorId, status, userid } = req.body;
    console.log("=== Approve Request ===");
    console.log("Doctor ID:", doctorId);
    console.log("Status:", status);
    console.log("User ID:", userid);
    
    const doctor = await docSchema.findByIdAndUpdate(
      doctorId,
      { status },
      { returnDocument: 'after' }
    );
    
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found", success: false });
    }

    const user = await userSchema.findById(userid);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    
    console.log("User found:", user.fullName);
    console.log("Current notifications:", user.notification);
    
    // Add notification
    const notificationMessage = `Your doctor application has been ${status}! You can now receive appointments.`;
    
    user.notification.push({
      type: "doctor-account-approved",
      message: notificationMessage,
      onClickPath: "/notification",
      createdAt: new Date()
    });
    
    // If approved, set isdoctor to true
    if (status === "approved") {
      user.isdoctor = true;
    }
    
    await user.save();
    console.log("Notification added. New notifications array:", user.notification);
    console.log("User saved successfully");

    return res.status(201).json({
      message: `Doctor status updated to ${status}`,
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error("Error in approve:", error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

// Reject a doctor
const getStatusRejectController = async (req, res) => {
  try {
    const { doctorId, status, userid } = req.body;
    console.log("=== Reject Request ===");
    
    const doctor = await docSchema.findByIdAndUpdate(
      doctorId,
      { status },
      { returnDocument: 'after' }
    );
    
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found", success: false });
    }

    const user = await userSchema.findById(userid);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }
    
    // Add rejection notification
    user.notification.push({
      type: "doctor-account-rejected",
      message: `Your doctor application has been ${status}. Please contact support for more information.`,
      onClickPath: "/notification",
      createdAt: new Date()
    });
    
    await user.save();
    console.log("Rejection notification sent to:", user.email);

    return res.status(201).json({
      message: "Doctor status updated",
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.error("Error in reject:", error);
    return res.status(500).json({ message: error.message, success: false });
  }
};

// Get all appointments (admin view)
const displayAllAppointmentController = async (req, res) => {
  try {
    const allAppointments = await appointmentSchema.find({});
    return res.status(200).json({
      success: true,
      message: "All appointments fetched",
      data: allAppointments,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Something went wrong", success: false });
  }
};

module.exports = {
  getAllUsersControllers,
  getAllDoctorsControllers,
  getStatusApproveController,
  getStatusRejectController,
  displayAllAppointmentController,
};