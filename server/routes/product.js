const { Product } = require('../models/products.js');
const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path');
const fs = require('fs').promises;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {

    cb(null, `${Date.now()}-${file.originalname}`);
  }
})

const upload = multer({ storage: storage })


router.get(`/`, async (req, res) => {
  const page = parseInt(req.query.page) || 1;  
  const limit = parseInt(req.query.limit) || 10;  

  try {
    const skip = (page - 1) * limit;
    const productList = await Product.find().skip(skip).limit(limit);
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    if (!productList) {
      return res.status(500).json({ success: false, message: "productList not found!" });
    }

    return res.status(200).json({
      success: true,
      data: productList,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        limit,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Internal server error" });
  }
});

router.post('/create', upload.single('image'), async (req, res) => {
  const { name, description, author, price, category } = req.body;

  if (!name || !description || !author || !price || !category) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  let imagePath = '';
  if (req.file) {
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ success: false, message: 'Invalid file type. Only JPG, PNG, and GIF' });
    }

    if (req.file.size > maxSize) {
      return res.status(400).json({ success: false, message: 'File size exceeds the limit of 5MB.' });
    }

    imagePath = `/uploads/${req.file.filename}`;
  }

  try {
    let product = new Product({
      name,
      description,
      author,
      price,
      category,
      image: imagePath,
    });

    product = await product.save();

    if (!product) {
      return res.status(500).json({ success: false, message: 'Error saving product' });
    }

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
     
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


router.put("/:id", upload.single("image"), async (req, res) => {
  const { name, description, author, price, category } = req.body;
  let imagePath = null;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    if (req.file) {
      if (product.image) {
        const oldImagePath = path.join(__dirname, '..', product.image); 
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }

      imagePath = '/uploads/' + req.file.filename;
    }

    product.name = name;
    product.description = description;
    product.author = author;
    product.price = price;
    product.category = category;
    if (imagePath) {
      product.image = imagePath; 
    }

    await product.save();
    return res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Failed to update product", error: error.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found", success: false });
    }

    if (product.image) {
      const imagePath = path.join(__dirname, '..', product.image); 
    
      try {
        await fs.unlink(imagePath); 
      } catch (err) {
        console.error("Error deleting image:", err);
        return res.status(500).json({ message: "Error deleting image", success: false, error: err.message });
      }
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(500).json({ message: "Failed to delete product from database", success: false });
    }

    res.status(200).json({ message: "Product deleted successfully", success: true });
  } catch (err) {
    console.error("Error during product deletion:", err);
    res.status(500).json({ message: "Error deleting product", success: false, error: err.message });
  }
});

/**
 * @swagger
 * tags:
 *   - name: Product    
 */



/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Product]
 *     summary: Get a list of products
 *     description: Retrieves a paginated list of products.
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number for pagination.
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Limit number of products per page.
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalProducts:
 *                       type: integer
 *                       example: 100
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Product]
 *     summary: Get product by ID
 *     description: Retrieves details of a single product by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the product
 *         example: "679f64c8768d10225a300feb"
 *         schema:
 *           type: string
 *           example: "5f50c31e1c4b3a2f5c29f125"
 *     responses:
 *       200:
 *         description: Product details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     tags: [Product]
 *     summary: Update a product by ID
 *     description: Updates an existing product's details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the product
 *         example: "679f6964ef841d810a40bde4"
 *         schema:
 *           type: string
 *           example: "5f50c31e1c4b3a2f5c29f125"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Product"
 *               description:
 *                 type: string
 *                 example: "This is the updated product description."
 *               author:
 *                 type: string
 *                 example: "Updated Author Name"
 *               price:
 *                 type: number
 *                 example: 39.99
 *               category:
 *                 type: string
 *                 example: "Updated Category"
 *               image:
 *                 type: string
 *                 example: "/uploads/updated-image.jpg"
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */



/**
 * @swagger
 * /api/products/create:
 *   post:
 *     tags: [Product]
 *     summary: Create a new product
 *     description: Adds a new product to the inventory.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - author
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Example Product"
 *               description:
 *                 type: string
 *                 example: "This is an example product."
 *               author:
 *                 type: string
 *                 example: "Author Name"
 *               price:
 *                 type: number
 *                 example: 29.99
 *               category:
 *                 type: string
 *                 example: "Category Name"
 *               image:
 *                 type: string
 *                 example: "/uploads/sample-image.jpg"
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     tags: [Product]
 *     summary: Delete a product by ID
 *     description: Deletes a product from the inventory by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Unique identifier of the product
 *         schema:
 *           type: string          
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */


module.exports = router;
