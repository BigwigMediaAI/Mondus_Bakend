const express = require("express");
const axios = require("axios");
const xml2js = require("xml2js");
const router = express.Router();

router.get("/properties", async (req, res) => {
  try {
    const response = await axios.get(
      "https://connecteo.in/mondus-property-listing/website-xml.php"
    );
    const xml = response.data;

    xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Failed to parse XML" });
      }

      //   console.log("Parsed result:", JSON.stringify(result, null, 2)); // ADD THIS

      res.json(result); // TEMP: Send full parsed result to inspect
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch XML data" });
  }
});

module.exports = router;
