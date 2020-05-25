const {Schema, model} = require('mongoose');

const categorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    products:[{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }]
});

module.exports = model('Category', categorySchema);