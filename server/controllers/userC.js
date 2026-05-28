const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = require("../schemas/userModel");
const docSchema = require("../schemas/docModel");
const appointmentSchema = require("../schemas/appointmentModel");

// Register a new user
const registerController = async (req, res) => {
  try {
    const existsUser = await userSchema.findOne({ email: req.body.email });
    if (existsUser) {
      return res
        .status(200)
        .json({ message: "User already exists", success: false });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new userSchema({ ...req.body, password: hashedPassword });
    await newUser.save();
    return res
      .status(201)
      .json({ message: "Register success", success: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message, success: false });
  }
};

// Login
const loginController = async (req, res) => {
  try {
    const user = await userSchema.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .json({ message: "User not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .json({ message: "Invalid email or password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });
    const userData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      type: user.type,
      isdoctor: user.isdoctor,
      notification: user.notification,
      seennotification: user.seennotification,
    };
    return res.status(200).json({
      message: "Login success",
      success: true,
      token,
      userData,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message, success: false });
  }
};

// Auth check — get current user from token
const authController = async (req, res) => {
  try {
    const user = await userSchema.findById(req.user.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message, success: false });
  }
};

// Apply as doctor
const docController = async (req, res) => {
  try {
    const newDoctor = new docSchema({
      ...req.body,
      userId: req.user.id,
      status: "pending",
    });
    await newDoctor.save();

    // Notify all admins
    const admins = await userSchema.find({ type: "admin" });
    for (const admin of admins) {
      admin.notification.push({
        type: "apply-doctor-request",
        message: `${req.body.fullName} has applied for a doctor account`,
        data: { doctorId: newDoctor._id, name: req.body.fullName },
        onClickPath: "/admin/doctors",
      });
      await admin.save();
    }
    return res.status(201).json({
      message: "Doctor registration request sent successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message, success: false });
  }
};

// Mark all notifications as seen
const getallnotificationController = async (req, res) => {
  try {
    const user = await userSchema.findById(req.user.id);
    user.seennotification.push(...user.notification);
    user.notification = [];
    await user.save();
    return res.status(200).json({
      message: "All notifications marked as read",
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message, success: false });
  }
};

// Delete all notifications
const deleteallnotificationController = async (req, res) => {
  try {
    const user = await userSchema.findById(req.user.id);
    user.notification = [];
    user.seennotification = [];
    await user.save();
    return res.status(200).json({
      message: "All notifications deleted",
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message, success: false });
  }
};

// Get all approved doctors (for user browsing)
const getAllDoctorsControllers = async (req, res) => {
  try {
    const doctors = await docSchema.find({ status: "approved" });
    return res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message, success: false });
  }
};

// Book an appointment
const appointmentController = async (req, res) => {
  try {
    const userInfo = JSON.parse(req.body.userInfo);
    const doctorInfo = JSON.parse(req.body.doctorInfo);

    const newAppointment = new appointmentSchema({
      userId: req.body.userId, 
      doctorId: req.body.doctorId,
      userInfo,
      doctorInfo,
      date: req.body.date,
      document: req.file || null,
      status: "pending",
    });
    await newAppointment.save();

    // Notify the doctor's user account
    const doctorUser = await userSchema.findById(doctorInfo.userId);
    if (doctorUser) {
      doctorUser.notification.push({
        type: "new-appointment-request",
        message: `New appointment from ${userInfo.fullName}`,
        data: { appointmentId: newAppointment._id },
        onClickPath: "/doctor/appointments",
      });
      await doctorUser.save();
    }

    return res.status(201).json({
      message: "Appointment booked successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message, success: false });
  }
};

// Get all appointments for the logged-in user
const getAllUserAppointments = async (req, res) => {
  try {
    const appointments = await appointmentSchema.find({
      userId: req.user.id,
    });
    const doctorIds = appointments.map((a) => a.doctorId);
    const doctors = await docSchema.find({ _id: { $in: doctorIds } });

    const appointmentsWithDoctor = appointments.map((appt) => {
      const doctor = doctors.find(
        (d) => d._id.toString() === appt.doctorId.toString()
      );
      return { ...appt.toObject(), docName: doctor ? doctor.fullName : "" };
    });

    return res.status(200).json({
      message: "Appointments fetched",
      success: true,
      data: appointmentsWithDoctor,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error.message, success: false });
  }
};

module.exports = {
  registerController,
  loginController,
  authController,
  docController,
  getallnotificationController,
  deleteallnotificationController,
  getAllDoctorsControllers,
  appointmentController,
  getAllUserAppointments,
};