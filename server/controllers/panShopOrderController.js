const asyncHandler = require("express-async-handler");
const panShopOrder = require('../models/panShopOrderModel');

const createPanShopOrder = asyncHandler(async (req, res) => {
  const { products, superStockistEmail, stockistEmail, panShopOwner_id, panShopOwnerstate, panShopOwneraddress, status, deliveryTime, assignTo } = req.body;

  if (!products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ error: "Products array is required and cannot be empty" });
  }

  const totalPrice = products.reduce((acc, product) => acc + product.quantity * product.price, 0);

  try {
    const order = await panShopOrder.create({
      products,
      totalPrice,
      superStockistEmail,
      stockistEmail,
      panShopOwner_id,
      panShopOwnerName: "John Doe", // Assuming this is static for now
      panShopOwnerstate,
      panShopOwneraddress,
      status,
      deliveryTime,
      assignTo,
    });

    res.status(201).json(order); // Return the created order
  } catch (error) {
    console.error("Error creating pan shop order:", error);
    res.status(500).json({ error: "Failed to create pan shop order" });
  }
});

const getPanShopOrderById = asyncHandler(async (req, res) => {
  const order = await panShopOrder.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error(" order detail not found");
  }
  res.status(200).json(order);
});

const deletePanShopOrderById = asyncHandler(async (req, res) => {
  const order = await panShopOrder.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order detail not found");
  }
  
  await order.deleteOne();
  
  res.status(200).json({ message: "Order deleted successfully" });
});

const updateEmail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const existingOrder = await panShopOrder.findById(id);
    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    const { superStockistEmail, stockistEmail, ...updateData } = req.body;

    // Update specific fields if they exist in the request body
    if (superStockistEmail) existingOrder.superStockistEmail = superStockistEmail;
    if (stockistEmail) existingOrder.stockistEmail = stockistEmail;
    
    // Loop through updateData to update any other fields
    for (let key in updateData) {
      existingOrder[key] = updateData[key];
    }

    // Save the updated order
    const updatedOrder = await existingOrder.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating panShop order:", error);
    res.status(500).json({ error: "An error occurred while updating the panShop order" });
  }
});

const updateAssignDeliveryTime = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const existingOrder = await panShopOrder.findById(id);
    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    const { assignTo, deliveryTime, status, ...updateData } = req.body;

    // Update specific fields if they exist in the request body
    if (assignTo) existingOrder.assignTo = assignTo;
    if (deliveryTime) existingOrder.deliveryTime = deliveryTime;
    if (status) existingOrder.status = status;

    // Loop through updateData to update any other fields
    for (let key in updateData) {
      existingOrder[key] = updateData[key];
    }

    // Save the updated order
    const updatedOrder = await existingOrder.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating panShop order:", error);
    res.status(500).json({ error: "An error occurred while updating the panShop order assignTo and DeliveyTime" });
  }
});

const getPanShopOrder = asyncHandler(async (req, res) => {
  const getOrder = await panShopOrder.find();
  res.status(200).json(getOrder);
});

const matchOtp=asyncHandler(async(req,res)=>{
 try {
  const order=await panShopOrder.findById(req.params.id)
  if (!order) {
    res.status(404);
    throw new Error(" order detail not found");
  }
   const {otp}=req.body;
   if(order.otp===otp){
    // res.status(200).json({message: "otp Match the data "})
    if(order.status==="pending"){
      order.status="delivered"
      order.save()
     // res.status(200).json(order)
    }
    res.status(200).json({order,message: "otp Match the data"})
   }
   else{
    res.status(404).json({message:"otp not match the data "})
   }

 } catch (error) {
  console.error("Error not geytting the order:", error);
    res.status(500).json({ error: "An error occurred while Getting the otp " });
  }
})

module.exports = { 
  createPanShopOrder, 
  getPanShopOrderById, 
  updateEmail, 
  getPanShopOrder, 
  deletePanShopOrderById,
  updateAssignDeliveryTime,
  matchOtp
};