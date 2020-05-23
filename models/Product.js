const {Schema, model} = require('mongoose');

const productSchema = new Schema({
    title:{
        type: String,
        required: true,
        minlength: 4
    },
    description: {
        type: String,
        required: true,
        minlength: 5
    },
    price: {
        type: Number,
        required: true,
        min: 1
    }
});

module.exports = model('Product', productSchema);
