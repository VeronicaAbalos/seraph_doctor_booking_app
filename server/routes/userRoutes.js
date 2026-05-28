const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  registerController,
  loginController,
  authController,
  docController,
  getallnotificationController,
  deleteallnotificationController,
  getAllDoctorsControllers,
  appointmentController,
  getAllUserAppointments,
} = require("../controllers/userC");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/getuserdata", authMiddleware, authController);
router.post("/registerdoc", authMiddleware, docController);
router.get("/getalldoctorsu", authMiddleware, getAllDoctorsControllers);
router.post(
  "/getappointment",
  authMiddleware,
  upload.single("image"),
  appointmentController
);
router.post("/getallnotification", authMiddleware, getallnotificationController);
router.post(
  "/deleteallnotification",
  authMiddleware,
  deleteallnotificationController
);
router.get("/getuserappointments", authMiddleware, getAllUserAppointments);

module.exports = router;