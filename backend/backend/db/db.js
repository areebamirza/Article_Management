const { MongoClient } = require("mongodb");
require("dotenv").config();

const withDB = async (operation, res) => {
  const client = new MongoClient(process.env.MONGO_URI);

  try {
    // Connect to MongoDB Atlas
    await client.connect();
    console.log("✅ MongoDB Atlas Connected Successfully");

    // Select Database
    const db = client.db(process.env.DATABASE);

    // Execute the operation
    await operation(db);

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);

    if (res) {
      res.status(500).json({
        message: "Error connecting to database",
        error: error.message,
      });
    }
  } finally {
    // Close Connection
    await client.close();
    console.log("🔌 MongoDB Connection Closed");
  }
};

module.exports = { withDB };