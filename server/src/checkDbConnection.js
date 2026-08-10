const dotenv = require('dotenv');
const mongoose = require('mongoose');

const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const checkDbConnection = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is missing in server/.env');
  }

  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });

  const admin = conn.connection.db.admin();
  await admin.ping();

  console.log(`MongoDB connected: ${conn.connection.host}`);
  console.log(`Database name: ${conn.connection.name}`);
  await mongoose.disconnect();
};

checkDbConnection().catch(async (error) => {
  console.error(`MongoDB connection failed: ${error.message}`);

  if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
    console.error('\nFix: MongoDB Atlas accepted the cluster address, but rejected the username/password.');
    console.error('1. In Atlas, open Database Access.');
    console.error('2. Reset the password for your database user.');
    console.error('3. Put that exact password in MONGODB_URI in server/.env.');
    console.error('4. If the password has @, #, /, :, or ?, URL-encode it or create a simpler password.\n');
  }

  if (error.message.includes('ENOTFOUND')) {
    console.error('\nFix: The cluster hostname in MONGODB_URI does not exist or cannot be resolved.');
    console.error('Copy a fresh connection string from Atlas > Database > Connect > Drivers.\n');
  }

  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
