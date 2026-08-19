const dns = require('node:dns');
const mongoose = require('mongoose');

// Configure Node.js to use Google & Cloudflare public DNS resolvers
// This resolves the common 'querySrv ECONNREFUSED' issue caused by local ISP/router DNS blocking SRV records.
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  console.warn('DNS server configuration warning:', dnsErr.message);
}

/**
 * Connects to MongoDB Atlas using the MONGODB_URI environment variable.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('Error: MONGODB_URI environment variable is not defined.');
    console.error('Please check your .env file and ensure MONGODB_URI is set.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
