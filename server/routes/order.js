const { Orders } = require('../models/orders');
const express = require('express');
const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        const ordersList = await Orders.find()
            .skip(skip)
            .limit(limit);

        if (!ordersList || ordersList.length === 0) {
            return res.status(404).json({ success: false, message: 'No orders found.' });
        }

        const totalOrders = await Orders.countDocuments();

        return res.status(200).json({
            success: true,
            orders: ordersList,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
            totalOrders: totalOrders,
        });

    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'An error occurred while fetching orders.' });
    }
});

router.get(`/pending`, async (req, res) => {
    try {
        const userId = req.query.userid;

        const ordersList = await Orders.find({ status: "pending", userid: userId });

        if (ordersList.length === 0) {
            return res.status(200).json({
                success: true,
                orders: [],
            });
        }

        return res.status(200).json({
            success: true,
            orders: ordersList,
        });

    } catch (error) {
        console.error("Error fetching pending orders:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const order = await Orders.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        return res.status(500).json({ message: 'An error occurred while fetching the order.' });
    }
});

router.post('/create', async (req, res) => {
    try {

        const { name, address, amount, paymentId, email, userid, products } = req.body;

        if (!name || !address || !amount || !paymentId || !email || !userid || !products) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        let order = new Orders({
            name,
            address,
            amount,
            paymentId,
            email,
            userid,
            products,
        });

        order = await order.save();

        return res.status(201).json(order);

    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({
            message: 'An error occurred while creating the order',
            error: error.message,
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedOrder = await Orders.findByIdAndDelete(req.params.id);

        if (!deletedOrder) {
            return res.status(404).json({
                message: 'Order not found!',
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Order Deleted!'
        });

    } catch (error) {
        console.error('Error deleting order:', error);
        return res.status(500).json({
            message: 'An error occurred while deleting the order',
            success: false,
            error: error.message
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name, address, amount, paymentId, email, userid, products, status } = req.body;

        if (!name || !address || !amount || !paymentId || !email || !userid || !products) {
            return res.status(400).json({
                message: 'Missing required fields!',
                success: false
            });
        }

        const order = await Orders.findByIdAndUpdate(
            req.params.id,
            {
                name,
                address,
                amount,
                paymentId,
                email,
                userid,
                products,
                status
            },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                message: 'Order not found!',
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Order updated successfully!',
            order
        });

    } catch (error) {
        console.error('Error updating order:', error);
        return res.status(500).json({
            message: 'An error occurred while updating the order',
            success: false,
            error: error.message
        });
    }
});

/**
 * @swagger
 * tags:
 *   - name: Order
 */

/**
 * @swagger
 * /api/order/:
 *   get:
 *     summary: Retrieve all orders with pagination
 *     tags: [Order]   
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         description: Number of orders per page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: A list of orders
 *       404:
 *         description: No orders found
 */

/**
 * @swagger
 * /api/order/pending:
 *   get:
 *     summary: Retrieve pending orders for a user
 *     tags: [Order]  
 *     parameters:
 *       - in: query
 *         name: userid
 *         description: User ID to filter pending orders
 *         example: "679f6dbb36528104c45f9eec"
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of pending orders
 *       404:
 *         description: No pending orders found
 */

/**
 * @swagger
 * /api/order/{id}:
 *   get:
 *     summary: Retrieve a specific order by ID
 *     tags: [Order]  
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The order ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The order details
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /api/order/create:
 *   post:
 *     summary: Create a new order
 *     tags: [Order]  
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               amount:
 *                 type: number
 *                 example: 1
 *               paymentId:
 *                 type: string
 *               email:
 *                 type: string
 *               userid:
 *                 type: string
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     productTitle:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                       example: 1
 *                     price:
 *                       type: number
 *                       example: 1
 *                     image:
 *                       type: string
 *                     subTotal:
 *                       type: number
 *                       example: 1
 *                     category:
 *                       type: string
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Missing required fields
 */

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update an existing order by ID
 *     tags: [Order]
 *     description: Updates the order with new information.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the order to be updated
 *         example: "679f71f2a7b9b7c6b4a2901c"
 *         schema:
 *           type: string
 *       - in: body
 *         name: order
 *         required: true
 *         description: Updated order information
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             address:
 *               type: string
 *             amount:
 *               type: number
 *               example: 1
 *             paymentId:
 *               type: string
 *             email:
 *               type: string
 *             userid:
 *               type: string
 *             products:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: string
 *                   productTitle:
 *                     type: string
 *                   quantity:
 *                     type: number
 *                     example: 1
 *                   price:
 *                     type: number
 *                     example: 1
 *                   image:
 *                     type: string
 *                   subTotal:
 *                     type: number
 *                     example: 1
 *                   category:
 *                     type: string
 *             status:
 *               type: string
 *               description: The current status of the order (e.g., 'pending', 'shipped', etc.)
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/order/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Order]  
 *     description: Deletes an order by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the order to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
module.exports = router;