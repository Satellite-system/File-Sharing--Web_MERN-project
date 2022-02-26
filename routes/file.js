const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const FileSchema = require("../models/fileModel");
const { v4: uuid4 } = require("uuid");
require("dotenv").config();

let storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, "uploads/"),
  filename: (req, file, callback) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;

    callback(null, uniqueName);
  },
});

let upload = multer({
  storage, // since key and value are same || storage: storage
  limit: { fileSize: 1000000 * 100 },
}).single("myfile"); //since we want single file to upload

router.post("/", (req, res) => {
  // store File
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }

    // Validate request
    if (!req.file) {
      return res.json({ error: "All Fields are required" });
    }

    // Store in database
    const file = new FileSchema({
      fileName: req.file.filename,
      path: req.file.path,
      size: req.file.size,
      uuid: uuid4(),
    });

    const response = await file.save();
    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
    // http://localhost:3000/files/23fhjdoerok45-8qp9jd3skel3
  });

  // Response ->link
});

router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;

  // Validate request
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: "All Fields are required." });
  }

  // Get data from database
  const file = await FileSchema.findOne({ uuid: uuid });
  if (!file) {
    return res.send({ error: "Link Expired" });
  }
  // if (file.sender) {
  //   // If File has already been send
  //   return res.status(422).send({ error: "File has been already send." });
  // }

  file.sender = emailFrom;
  file.receiver = emailTo;
  const response = await file.save();

  // Send email
  const sendMail = require("../services/emailServices");
  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: "Speedy File Sharing",
    text: `${emailFrom} shared a file with you.`,
    html: require("../services/emailTemplate")({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
      size: parseInt(file.size / 1024) + " KB",
      expires: "24 hours",
    }),
  });
  return res.send({ success: true });
});

module.exports = router;
