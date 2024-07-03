const express = require("express");
const errorHandler = require("../server/middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const cors = require("cors");

const locationRoutes = require("./routes/locationRoute");

connectDb(); //calls from config/dbConnection file

const app = express();

app.use(cors());

const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/contacts", require("./routes/contactRouters"));
app.use("/api/administrators", require("./routes/administratorRoutes"));
app.use("/api/panshopadmin", require("./routes/panShopadminRoutes"));
app.use("/api/forgetPassword", require("./routes/authRoutes"));
app.use("/api/resetPassword", require("./routes/authRoutes"));

app.use("/api/panShopOwner", require("./routes/panShopOwnerRoutes"));
app.use("/api/panshop/order", require("./routes/panShopOrderRoutes"));

// SuperStockist Signup

app.use("/api/superstockist", require("./routes/superStockistSignupRoutes"));
app.use(
  "/api/superStockistDetails",
  require("./routes/superStockistDetailsRoutes")
);
app.use(
  "/api/superStockistProductDetails",
  require("./routes/superStockistProductDetailsRoutes")
);

//QRGeneratorBoys
app.use("/api/qrGeneraterBoy", require("./routes/qrGeneraterBoyRoutes"));

app.use("/api/location", locationRoutes);

app.use("/api/sos", require("./routes/sosRoutes"));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server runiinrng port no ${port}`);
});
