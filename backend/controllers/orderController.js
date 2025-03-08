import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";


// Placing orders using COD Method

const placeOrder = async (req, res) => {

    try {

        const { userId, items, amount, address} = req.body;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Cash On Delivery",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId, {cartData:{}})

        res.json({success:true, message: "Order Placed"});

    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message});
    }

}

// Placing orders using SSLCommerce Method

const placeOrderSSLCommerce = async (req, res) => {
    
}

// All Order data for Admin Panel

const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({success:true, orders})

    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message});
    }
}

// User Order data for FrontEnd

const userOrders = async (req, res) => {
    try {
        
        const { userId } = req.body

        const orders = await orderModel.find({ userId })

        res.json({success:true, orders})

    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message});
    }
}

// update order status from Admin Panel

const updateStatus = async (req, res) => {
    try {
        
        const { orderId, status } = req.body
        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success:true, message: 'Status Updated'})

    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message});
    }
}

export {placeOrder, placeOrderSSLCommerce, allOrders, userOrders, updateStatus}