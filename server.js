const express = require("express");
const app = express();
const PORT = 3000;

// CRITICAL LINE
app.use(express.json());

app.use(express.static("public"));

const officeLat = 7.466233089765386;
const officeLng = 80.61632719551174;
const allowedRadius = 300;

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = deg => deg * Math.PI / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

app.post("/check-location", (req, res) => {
  console.log("Incoming body:", req.body);

  const { latitude, longitude, accuracy } = req.body;

  if (!latitude || !longitude) {
    return res.json({
      success: false,
      message: "No location received",
      latitude: null,
      longitude: null,
      accuracy: null,
      distance: null
    });
  }

  const distance = getDistance(latitude, longitude, officeLat, officeLng);
  const inside = distance <= allowedRadius;

  res.json({
    success: inside,
    message: inside
      ? "Location Verified ✅"
      : "You are outside the allowed area ❌",
    latitude,
    longitude,
    accuracy,
    distance: distance.toFixed(2)
  });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});