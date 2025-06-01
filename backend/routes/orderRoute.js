import express from 'express'
import {placeOrder, placeOrderSSLCommerce, allOrders, userOrders, updateStatus} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'
import { placeOrderBkash, placeOrderSteadfast } from "../controllers/orderController.js";


const orderRouter = express.Router()

//Admin features

orderRouter.post('/list', adminAuth, allOrders)
orderRouter.post('/status', adminAuth, updateStatus)

//Payment features

orderRouter.post('/place', authUser, placeOrder)
orderRouter.post("/place-bkash", placeOrderBkash);
orderRouter.post("/place-steadfast", placeOrderSteadfast);

//User Feature

orderRouter.post('/userorders', authUser, userOrders)

export default orderRouter