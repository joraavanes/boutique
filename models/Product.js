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
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    categoryId:{
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }
});

module.exports = model('Product', productSchema);
