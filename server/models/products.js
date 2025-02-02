const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type: String,
       
    },
    description: {
        type: String,
        
    },
    image: {
        type: String, 
        required: false,
    },
    author: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        default: ''
    },   
    dateCreated: {
        type: Date,
        default: Date.now,
    },

}) 


productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});

exports.Product = mongoose.model('Product', productSchema);

