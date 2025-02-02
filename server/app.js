const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


require('dotenv/config');

app.use(cors())
app.options('*', cors())

//middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json());

//Route
const productRoutes = require('./routes/product.js');
const userRoutes = require('./routes/user.js');
const cartRoutes = require('./routes/cart.js');
const orderRoutes = require('./routes/order.js')


// Swagger setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ban9Din API',
            description: 'API for managing products, users, carts, and orders in an Ban9Din BookStore',
            version: '1.0.0',
        },
    },
    apis: ['./routes/*.js'],  
};

// Create Swagger specification
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Set up Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(`/api/products`, productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes)


//Database
mongoose.connect(process.env.CONNECTION_STRING, {

})
    .then(() => {
        console.log('Database Connection is ready...');
        //Server
        app.listen(process.env.PORT, () => {
            console.log(`server is running http://localhost:${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log(err);
    })
