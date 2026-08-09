# MongoDB Setup Guide

## Problem
Your app cannot connect to MongoDB, causing login and signup to fail with "Registration failed" error.

## Quick Solutions

### Option 1: MongoDB Atlas (Recommended - FREE & Cloud-based)

1. **Create Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Sign up for a free account (no credit card required)

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "FREE" M0 tier
   - Select a cloud provider and region (closest to you)
   - Click "Create"

3. **Setup Database Access**
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Choose username & password (e.g., `nykaauser` / `nykaapass123`)
   - Set role to "Read and write to any database"
   - Click "Add User"

4. **Setup Network Access**
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/...`)
   - Replace `<password>` with your actual password

6. **Update Your .env**
   - Open `server/.env`
   - Update the `MONGODB_URI` line:
   ```
   MONGODB_URI=mongodb+srv://nykaauser:nykaapass123@cluster0.xxxxx.mongodb.net/nykaa-clone?retryWrites=true&w=majority
   ```

7. **Restart Server**
   ```bash
   cd server
   npm run dev
   ```

### Option 2: Local MongoDB (For Development)

1. **Install MongoDB**
   ```bash
   # Ubuntu/Debian
   sudo apt-get update
   sudo apt-get install -y mongodb

   # Or install MongoDB Community Edition (recommended)
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```

2. **Start MongoDB**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod  # Auto-start on boot
   ```

3. **Update .env**
   - Open `server/.env`
   - Change `MONGODB_URI` to:
   ```
   MONGODB_URI=mongodb://localhost:27017/nykaa-clone
   ```

4. **Restart Server**
   ```bash
   cd server
   npm run dev
   ```

## Verify Connection

When MongoDB connects successfully, you should see:
```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
```

Or:
```
✅ MongoDB Connected: localhost
```

## Seed Database (Optional)

Once connected, add sample data:
```bash
cd server
npm run seed
```

## Still Having Issues?

Check:
- [ ] MongoDB Atlas IP whitelist includes 0.0.0.0/0
- [ ] Database user credentials are correct
- [ ] Connection string password doesn't contain special characters (or is URL-encoded)
- [ ] Network/firewall isn't blocking MongoDB ports
- [ ] For local: MongoDB service is running (`sudo systemctl status mongod`)
