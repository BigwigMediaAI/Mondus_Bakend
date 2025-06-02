const express = require("express");
const router = express.Router();
const Prompt = require("../models/prompt.model");
const Notify = require("../models/notify");

const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

const companyInfo = `
**About Mondus Properties**  
Mondus Properties is a forward-thinking real estate agency and investment advisory firm based in Dubai, UAE. As a trusted name in the region, we specialize in helping clients navigate the dynamic Dubai property market with confidence. Our curated portfolio includes some of the most sought-after properties in the city, offering premium options for buying, renting, or investing.

Whether you're a first-time homebuyer, seasoned investor, or searching for your dream residence, our dedicated team ensures a seamless, personalized journey to find the perfect property. At Mondus Properties, we combine global expertise with local insights to make your real estate experience effortless and rewarding.

**Why Choose Us**  
- Unmatched access to Dubai’s most desirable locations and properties  
- Transparent, ethical, and client-first advisory at every step  
- Expertise in luxury, investment-grade, and off-plan real estate  
- End-to-end support – from discovery to deal closure and beyond  

**Our Services**  
1. **Luxury Property Sales**: Premium homes and apartments in Dubai's prime locations.  
2. **Real Estate Investment Advisory**: Tailored strategies for high-yield and long-term gains.  
3. **Rental Services**: Finding the perfect short- or long-term rental property.  
4. **Property Management**: Complete oversight and care for your investment.  
5. **Off-Plan Advisory**: Expert guidance on upcoming projects with strong potential.

**Our Vision**  
To empower clients in making smart, strategic real estate decisions by delivering excellence, integrity, and value – and turning dream properties into real assets.

**Target Clients**  
- Local & international homebuyers  
- High-net-worth individuals  
- Long-term investors  
- Corporate & institutional clients  
`;

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

router.post("/chatbot", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const prompt = `
You are a helpful chatbot for Granth Dream Homes, a luxury real estate company in Goa. 
Use the company details below to answer the user's question in a friendly and informative way.

Company Info:
${companyInfo}

User Question: ${message}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a helpful real estate assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const reply =
      response.choices[0].message.content.trim() ||
      "Sorry, I couldn’t find an answer.";

    res.json({ reply });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "Something went wrong with the chatbot." });
  }
});

module.exports = router;
