const { Cart } = require('../models/carts');
const express = require('express');
const router = express.Router();

// Discounts
const DISCOUNTS = {
    2: 0.10, // 10%
    3: 0.20, // 20%
    4: 0.30, // 30%
    5: 0.40, // 40%
    6: 0.50, // 50%
    7: 0.60, // 60%
};

router.get("/", async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId || typeof userId !== "string" || userId.trim() === "") {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const cartList = await Cart.find({ userId });

        let bookCount = {};
        let pricePerBook = {};

        cartList.forEach(item => {
            bookCount[item.productId] = (bookCount[item.productId] || 0) + item.quantity;
            pricePerBook[item.productId] = item.price;
        });

        // console.log('Book count after forEach: ', bookCount);
        // console.log('Price per book after forEach: ', pricePerBook);

        let totalPrice = 0;
        let totalBasePrice = 0;
        let totalDiscount = 0;

        while (Object.keys(bookCount).length > 0) {
            let uniqueCount = Object.keys(bookCount).length;
            let basePrice = 0;
            let discount = DISCOUNTS[uniqueCount] || 0;

            for (let productId in bookCount) {
                if (bookCount[productId] > 0) {
                    basePrice += pricePerBook[productId];
                }
            }

            let discountAmount = basePrice * discount;

            totalBasePrice += basePrice;
            totalDiscount += discountAmount;
            totalPrice += basePrice - discountAmount;

            // console.log(`Round info:`);
            // console.log(`Unique books count: ${uniqueCount}`);
            // console.log(`Base price for this round: ${basePrice}`);
            // console.log(`Discount applied: ${discount * 100}%`);
            // console.log(`Discount amount: ${discountAmount}`);
            // console.log(`Price after discount for this round: ${basePrice - discountAmount}`);
            // console.log(`---`);

            for (let productId in bookCount) {
                if (--bookCount[productId] === 0) delete bookCount[productId];
            }
        }

        // console.log(`Total price before discount: ${totalBasePrice} Baht`);
        // console.log(`Total Price: ${totalPrice} Baht`);
        // console.log(`Total discount: ${totalDiscount} Baht`);

        return res.status(200).json({
            success: true,
            totalBasePrice,
            totalDiscount,
            total: totalPrice,
            data: cartList
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.post('/add', async (req, res) => {
    try {
        const { productTitle, image, price, quantity, subTotal, productId, userId, categoryName } = req.body;

        if (!productId || !userId || !productTitle || !price || !quantity) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const existingCartItem = await Cart.findOne({ productId, userId });

        if (existingCartItem) {
            return res.status(409).json({ success: false, message: "Product already added to the cart" });
        }

        const cartList = new Cart({
            productTitle,
            image,
            price,
            quantity,
            subTotal,
            productId,
            userId,
            categoryName
        });

        const newCartlist = await cartList.save();

        return res.status(201).json({ success: true, data: newCartlist });

    } catch (error) {
        console.error("Error adding to cart:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const cartItem = await Cart.findById(req.params.id);

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: "The cart item with the given ID was not found!"
            });
        }

        const deletedItem = await Cart.findByIdAndDelete(req.params.id);

        if (!deletedItem) {
            return res.status(500).json({
                success: false,
                message: "Failed to delete cart item. Please try again later."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cart Item Deleted!"
        });

    } catch (error) {
        console.error("Error deleting cart item:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

router.put('/:id', async (req, res) => {
    try {

        const { productTitle, image, price, quantity, subTotal, productId, userId, categoryName } = req.body;


        if (!productTitle || !image || !price || !quantity || !subTotal || !productId || !userId || !categoryName) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        const updatedCartItem  = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                productTitle: req.body.productTitle,
                image: req.body.image,
                price: req.body.price,
                quantity: req.body.quantity,
                subTotal: req.body.subTotal,
                productId: req.body.productId,
                userId: req.body.userId,
                categoryName: req.body.categoryName,
            },
            { new: true }
        );

        if (!updatedCartItem) {
            return res.status(500).json({
                message: 'Cart item cannot be updated!',
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            data: updatedCartItem // ส่งรายการหนังสือทั้งหมดกลับไป
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

/**
 * @swagger
 * tags:
 *   - name: Cart
 *     
 */


/**
 * @swagger
 * /api/cart:
 *   get:
 *     tags: [Cart]
 *     summary: Get cart items by user ID
 *     description: Fetches all cart items for a specific user
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           description: User ID to get the cart items
 *           example: "679f6dbb36528104c45f9eec"
 *     responses:
 *       200:
 *         description: A list of cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 totalBasePrice:
 *                   type: number
 *                 totalDiscount:
 *                   type: number
 *                 total:
 *                   type: number
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Missing or invalid userId
 *       500:
 *         description: Internal server error
 */

/**
 /**
 * @swagger
 * /api/cart/add:
 *   post:
 *     tags: [Cart]
 *     summary: Add a new product to the cart
 *     description: Adds a product to the user's cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productTitle:
 *                 type: string
 *                 description: The title of the product
 *               image:
 *                 type: string
 *                 description: The image URL of the product
 *               price:
 *                 type: number
 *                 description: Price of the product
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the product
 *                 example: 1
 *               subTotal:
 *                 type: number
 *                 description: Subtotal price for the product
 *                 example: 1
 *               productId:
 *                 type: string
 *                 description: Unique identifier of the product
 *               categoryName:
 *                 type: string
 *                 description: Category name of the product
 *               userId:
 *                 type: string
 *                 description: Unique identifier of the user
 *     responses:
 *       201:
 *         description: Product added to cart
 *       400:
 *         description: Missing required fields
 *       409:
 *         description: Product already in cart
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     tags: [Cart]
 *     summary: Update a product in the cart by ID
 *     description: Updates the details of a product in the user's cart
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the cart item to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productTitle:
 *                 type: string
 *                 description: The title of the product
 *               image:
 *                 type: string
 *                 description: The image URL of the product
 *               price:
 *                 type: number
 *                 description: Price of the product
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the product
 *                 example: 1
 *               subTotal:
 *                 type: number
 *                 description: Subtotal price for the product
 *                 example: 1
 *               productId:
 *                 type: string
 *                 description: Unique identifier of the product
 *               categoryName:
 *                 type: string
 *                 description: Category name of the product
 *               userId:
 *                 type: string
 *                 description: Unique identifier of the user
 *     responses:
 *       200:
 *         description: Cart item updated
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     tags: [Cart]
 *     summary: Delete a product from the cart by ID
 *     description: Removes a product from the user's cart
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the cart item to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart item deleted
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Internal server error
 */

  
module.exports = router;