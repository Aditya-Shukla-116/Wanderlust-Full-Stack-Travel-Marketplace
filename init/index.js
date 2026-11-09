// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

// const initDB = async () => {
//   await Listing.deleteMany({});
//   initData.data = initData.data.map((obj) => ({ ...obj, owner:"6aeb529e10ffec512b1d31d3"}))
//   await Listing.insertMany(initData.data);
//   console.log("data was initialized");
// };

// initDB();

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const initData = require("./data.js"); // Imports the exported object
const Listing = require("../models/listing.js");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || "",
    api_key: process.env.CLOUD_API_KEY || "",
    api_secret: process.env.CLOUD_API_SECRET || ""
});

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(async () => {
        console.log("Connected to MongoDB successfully.");
        await initDB(); 
    })
    .catch((err) => {
        console.error("CRITICAL DATABASE CONNECTION ERROR:", err.message);
    });

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        console.log("Stale MongoDB listings collection records cleared.");

        // 🌟 THE SYNCHRONIZATION FIX: Target initData.data explicitly to grab your array!
        const targetArray = initData.data;

        if (!targetArray || !Array.isArray(targetArray)) {
            throw new Error("Could not find the 'data' array inside your data.js file module exports!");
        }

        console.log(`Migrating ${targetArray.length} listing image assets securely to Cloudinary. Please hold...`);

        // Use a strict index loop to modify the true array elements inside memory
        for (let i = 0; i < targetArray.length; i++) {
            targetArray[i].owner = "6aeb529e10ffec512b1d31d3";

            if (targetArray[i].image && typeof targetArray[i].image.url === "string") {
                try {
                    const uploadResponse = await cloudinary.uploader.upload(targetArray[i].image.url.trim(), {
                        folder: "wanderlust_DEV",
                        resource_type: "auto"
                    });

                    // Directly overwrite the nested image values with your Cloudinary properties
                    targetArray[i].image = {
                        url: uploadResponse.secure_url,
                        filename: uploadResponse.public_id
                    };
                    
                    console.log(`[${i+1}/${targetArray.length}] Uploaded and linked: "${targetArray[i].title}"`);
                } catch (uploadError) {
                    console.warn(`WARNING: Failed for: "${targetArray[i].title}". Error: ${uploadError.message}`);
                    targetArray[i].image = {
                        url: "https://unsplash.com",
                        filename: "wanderlust_DEV/default_fallback"
                    };
                }
            }
        }

        // Drop the freshly mapped secure array into your MongoDB collection
        await Listing.insertMany(targetArray);
        console.log("🎉 SUCCESS! Database fully populated with secure Cloudinary public_ids!");
        process.exit(0);

    } catch (criticalScriptError) {
        console.error("CRITICAL SCRIPT EXECUTION HALTED:", criticalScriptError.message);
        process.exit(1);
    }
};
