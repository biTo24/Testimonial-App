const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' folder

// Endpoint to get testimonials
app.get("/testimonials", (req, res) => {
  fs.readFile(path.join(__dirname, 'testimonials.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Failed to load testimonials" });
    }
    res.json(JSON.parse(data || "{}"));
  });
});

// Endpoint to post a new testimonial
app.post("/testimonials", (req, res) => {
  const newTestimonial = req.body;

  fs.readFile(path.join(__dirname, 'testimonials.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Failed to save testimonial" });
    }

    const testimonials = JSON.parse(data || "{}").testimonials || [];
    testimonials.push(newTestimonial);

    fs.writeFile(path.join(__dirname, 'testimonials.json'), JSON.stringify({ testimonials }), 'utf8', (err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to save testimonial" });
      }
      res.status(201).json({ message: "Testimonial saved successfully!" });
    });
  });
});

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Serve create-testimonial.html
app.get("/create-testimonial", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "create-testimonial.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
