const express = require("express");
const cors = require("cors");
require("dotenv").config();
const router = require("./routes/route.js");
const dns=require("dns")
dns.setServers(["8.8.8.8","8.8.4.4"])

const app = express();

// CORS configuration
const allowedOrigins = process.env.CLIENT_URL;
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["POST", "GET", "PUT", "DELETE" , "PATCH","OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/", router);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
