const { User } = require('../models/user');

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");



router.post(`/signup`, async (req, res) => {
    const { name, email, password, isAdmin } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: true, msg: "Name, email, and password are required." });
    }

    try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({ error: true, msg: "User already exists!" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const result = await User.create({
            name: name,
            email: email,
            password: hashPassword,
            isAdmin: isAdmin || false,
        });

        const token = jwt.sign({ email: result.email, id: result._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

        return res.status(200).json({
            user: result,
            token: token,
        });

    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).json({ error: true, msg: "Something went wrong. Please try again." });
    }
});



router.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: true, msg: "Email and password are required." });
    }

    try {
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({ error: true, msg: "User not found!" });
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if (!matchPassword) {
            return res.status(400).json({ error: true, msg: "Invalid credentials" });
        }

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

        return res.status(200).send({
            user: existingUser,
            token: token,
            msg: "User authenticated"
        });

    } catch (error) {
        console.error("Error during signin:", error);  
        res.status(500).json({ error: true, msg: "Something went wrong. Please try again." });
    }
});



router.post(`/signin/admin`, async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: true, msg: "Email and password are required." });
    }

    try {
        const existingAdmin = await User.findOne({ email: email });
        if (!existingAdmin) {
            return res.status(404).json({ error: true, msg: "Admin not found!" });
        }

        if (!existingAdmin.isAdmin) {
            return res.status(403).json({ error: true, msg: "Access denied. You are not an admin." });
        }

        const matchPassword = await bcrypt.compare(password, existingAdmin.password);
        if (!matchPassword) {
            return res.status(400).json({ error: true, msg: "Invalid credentials" });
        }

        const token = jwt.sign({ email: existingAdmin.email, id: existingAdmin._id }, process.env.JSON_WEB_TOKEN_SECRET_KEY);

        return res.status(200).send({
            user: existingAdmin,
            token: token,
            msg: "Admin authenticated"
        });

    } catch (error) {
        console.error("Error during admin signin:", error);  
        res.status(500).json({ error: true, msg: "Something went wrong. Please try again." });
    }
});



router.get(`/`, async (req, res) => {
    try {
        const userList = await User.find();
        const userCount = userList.length; 

        if (userCount === 0) {
            return res.status(404).json({ success: false, message: "No users found.", count: 0 });
        }

        res.status(200).json({ success: true, count: userCount, users: userList });
    } catch (error) {
        console.error("Error fetching user list:", error);
        res.status(500).json({ success: false, message: "An error occurred while fetching users." });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'The user with the given ID was not found.' });
        }
        
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user by ID:", error); 
        res.status(500).json({ message: 'An error occurred while fetching the user.', error: error.message });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }
        
        res.status(200).json({ success: true, message: 'The user has been deleted successfully.' });
    } catch (error) {
        console.error("Error deleting user:", error); 
        res.status(500).json({ success: false, message: "An error occurred while deleting the user.", error: error.message });
    }
});

/**
 * @swagger
 * tags:
 *   - name: User
 */


/**
 * @swagger
 * /api/user/:
 *   get:
 *     summary: Get all users
 *     description: Retrieves a list of all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: A list of users
 *       404:
 *         description: No users found
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /api/user/{id}:
 *   get:
 *     summary: Get user by ID
 *     description: Retrieves a user by their ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to retrieve
 *         example: "679f6d9236528104c45f9ebc"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: User Signup
 *     description: Registers a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               isAdmin:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User successfully registered
 *       400:
 *         description: Bad request (Missing fields or user already exists)
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /api/user/signin:
 *   post:
 *     summary: User Signin
 *     description: Authenticates an existing user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "root@email.com"
 *               password:
 *                 type: string
 *                 example: "root"
 *     responses:
 *       200:
 *         description: User authenticated successfully
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */


/**
 * @swagger
 * /api/user/signin/admin:
 *   post:
 *     summary: Admin Signin
 *     description: Authenticates an admin user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "root@email.com"
 *               password:
 *                 type: string
 *                 example: "root"
 *     responses:
 *       200:
 *         description: Admin authenticated successfully
 *       400:
 *         description: Invalid credentials
 *       403:
 *         description: Access denied (Not an admin)
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/user/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     description: Deletes a user by their ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User successfully deleted
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */





module.exports = router;