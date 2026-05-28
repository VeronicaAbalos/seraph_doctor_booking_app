const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  updateDoctorProfileController,
  getAllDoctorAppointmentsController,
  handleStatusController,
  documentDownloadController,
} = require("../controllers/doctorC");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post("/updateprofile", authMiddleware, updateDoctorProfileController);
router.get(
  "/getdoctorappointments",
  authMiddleware,
  getAllDoctorAppointmentsController
);
router.post("/handlestatus", authMiddleware, handleStatusController);
router.get(
  "/getdocumentdownload",
  authMiddleware,
  documentDownloadController
);

module.exports = router;