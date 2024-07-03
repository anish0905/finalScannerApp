const express = require("express");
const router = express.Router();
const {registerQrGeneraterBoy, loginUser, currentUser, getAllDeliveryBoyDeatils} = require("../controllers/qrGeneratorBoySignupController");
const validateToken = require("../middleware/qrGeneraterBoyValidateTokenHandler");

// Register
router.post("/register", registerQrGeneraterBoy);

//Login
router.post("/login",loginUser);

    // Current user information
router.get("/current",validateToken, currentUser);
router.get("/allDetailsDeliverBoy",getAllDeliveryBoyDeatils);

module.exports = router