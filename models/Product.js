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
    imageUrl: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 1
    },
    show:{
        type: Boolean,
        required: true
    },
    issuedDate:{
        type: Number,
        required: true
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
