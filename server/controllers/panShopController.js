const asyncHandler = require("express-async-handler");
const axios = require('axios');
const PanShopOwner = require("../models/panShopModel");
const fs = require('fs');

const qrcode = require('qrcode');

function validatePhoneNumber(phoneNumber) {
    var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneno.test(phoneNumber);
}


const createPanShopOwner = asyncHandler(async (req, res) => {
    const { panShopOwner, phoneNumber, address, latitude, longitude ,id } = req.body;

    

    if (!panShopOwner || !phoneNumber || !address || !latitude || !longitude ) {
        return res.status(400).json({ error: "panShopOwner, phoneNumber, address, latitude longitude are mandatory fields" });
    }

    if (!validatePhoneNumber(phoneNumber)) {
        return res.status(400).json({ error: "Invalid phone number format" });
    }
    

    try {

        const existingOwner = await PanShopOwner.findOne({ phoneNumber });

        if (existingOwner) {
            return res.status(400).json({ error: "Phone number already exists" });
        }
        // Create the pan shop owner 
        const owner = await PanShopOwner.create({
            panShopOwner,
            phoneNumber,
            address,
            latitude,
            longitude,
            user_id:id||"" // Make sure this is correct
        });

         console.log(owner)
        const qrData = JSON.stringify({
            Id :owner._id,
            panShopOwner: owner.panShopOwner
        });
        // Generate and store the QR code
        const qrImageFilePath =` qr_${owner._id}.png`; // File path for the QR code image
        await qrcode.toFile(qrImageFilePath, qrData);

        // Read the QR code image file as a buffer
        const qrImageData = fs.readFileSync(qrImageFilePath);

        // Delete the QR code image file after reading it
        fs.unlinkSync(qrImageFilePath);

        // Store the QR code image data in the owner object
        owner.qrCodeImage = {
            data: qrImageData,
            contentType: 'image' // Adjust according to the image format
        };
        await owner.save();
        const qrCodeBase64 = qrImageData.toString('base64');
        res.status(201).json({ qrCodeBase64 ,owner});
    } catch (error) {
        // If an error occurs during the creation process, send an error response
        console.error(error);
        res.status(500).json({ error: "Failed to create pan shop owner" });
    }
});


const updatePanShoperOwner = asyncHandler(async (req, res) => {
  try {
    const ownerId = req.params.id;
    const { panShopOwner, phoneNumber, address, latitude, longitude } = req.body;

    // Check if the pan shop owner exists
    let owner = await PanShopOwner.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ error: 'Pan shop owner not found' });
    }

    // Validate phone number format
    if (!validatePhoneNumber(phoneNumber)) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    // Check if phone number already exists for another owner
    const existingOwner = await PanShopOwner.findOne({ phoneNumber: phoneNumber, _id: { $ne: ownerId } });
    if (existingOwner) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }

    // Update the pan shop owner
    const updatedOwner = await PanShopOwner.findByIdAndUpdate(ownerId, {
      panShopOwner,
      phoneNumber,
      address,
      latitude,
      longitude,
    }, { new: true });

    if (!updatedOwner) {
      return res.status(500).json({ error: 'Failed to update pan shop owner' });
    }

    // Generate QR code and update owner with QR code data
    const qrData = JSON.stringify({
      Id: updatedOwner._id,
      panShopOwner: updatedOwner.panShopOwner,
    });

    const qrImageFilePath = `qr_${updatedOwner._id}.png`;
    await qrcode.toFile(qrImageFilePath, qrData);
    const qrImageData = fs.readFileSync(qrImageFilePath);
    fs.unlinkSync(qrImageFilePath);

    // Update the pan shop owner with the new QR code
    updatedOwner.qrCodeImage = {
      data: qrImageData,
      contentType: 'image/png', // Adjust content type as needed
    };
    await updatedOwner.save();

    const qrCodeBase64 = qrImageData.toString('base64');

    // Return the updated pan shop owner with QR code base64
    res.status(200).json({ qrCodeBase64, owner: updatedOwner });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to update pan shop owner' });
  }
});

  


const deletePanShopOwner = asyncHandler(async (req, res) => {

    const owner = await PanShopOwner.findById(req.params.id);

    if (!owner) {
        res.status(404);
        throw new Error("product not found")

    }

    if(owner.user_id.toString() !== req.userExecutive.id)
    {
        res.status(403);
        throw new Error("User dont't have permission to other user products");
    }

    await PanShopOwner.deleteOne({ _id: req.params.id });




    res.status(200).json(owner);
});

const getPanShopOwnerById = asyncHandler(async (req, resp) => {
    const owner = await PanShopOwner.findById(req.params.id);
    if (!owner) {
        resp.status(404);
        throw new Error("PanShop Owner Not Found");
    }
    
    // Generate QR code data
    const qrData = JSON.stringify({
        Id :owner._id,
        panShopOwner: owner.panShopOwner,
    });
    
    // Generate QR code image
    const qrImageFilePath = `qr_$owner._id}.png`; // File path for the QR code image
    await qrcode.toFile(qrImageFilePath, qrData);

    // Read the QR code image file as a buffer
    const qrImageData = fs.readFileSync(qrImageFilePath);

    // Delete the QR code image file after reading it
    fs.unlinkSync(qrImageFilePath);

    // Convert QR code image data to base64
    const qrCodeBase64 = qrImageData.toString('base64');

    // Store the QR code image data in the pan shop owner object
    owner.qrCodeImage = {
        data: qrImageData,
        contentType: 'image/png' // Adjust according to the image format
    };

    // Send the pan shop owner details along with the base64 representation of the QR code
    resp.status(200).json({ qrCodeBase64, owner });
});

const getAllPanShopOwner = asyncHandler(async (req, resp) => {
    const shop = await PanShopOwner.find({ user_id: req.userExecutive.id });
    resp.status(200).json(shop)
});


module.exports = { createPanShopOwner ,updatePanShoperOwner ,deletePanShopOwner,getAllPanShopOwner ,getPanShopOwnerById};