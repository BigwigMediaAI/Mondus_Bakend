const express = require("express");
const router = express.Router();
const Prompt = require("../models/prompt.model");
const Notify = require("../models/notify");

// POST /api/prompt/submit
router.post("/prompt", async (req, res) => {
  const { name, phone, email } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newPrompt = new Prompt({ name, phone, email });
    await newPrompt.save();
    return res.status(200).json({ message: "Form submitted and saved." });
  } catch (error) {
    console.error("Error saving prompt:", error);
    return res.status(500).json({ error: "Failed to save form." });
  }
});

router.get("/consultation", async (req, res) => {
  try {
    const consultations = await Prompt.find().sort({ createdAt: -1 });
    res.status(200).json(consultations);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// notify me

router.post("/notifyme", async (req, res) => {
  const { purpose, category, bedrooms, name, phone, email } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newPrompt = new Notify({
      purpose,
      category,
      bedrooms,
      name,
      phone,
      email,
    });
    await newPrompt.save();
    return res.status(200).json({ message: "Form submitted and saved." });
  } catch (error) {
    console.error("Error saving prompt:", error);
    return res.status(500).json({ error: "Failed to save form." });
  }
});

router.get("/notify", async (req, res) => {
  try {
    const consultations = await Notify.find().sort({ createdAt: -1 });
    res.status(200).json(consultations);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
