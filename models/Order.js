const {Schema, model} = require('mongoose');

const orderSchema = new Schema({
    issuedDate: {
        type: Date,
        required: true,
        default: function(){
            return new Date().valueOf();
        }
    },
    items:[{
        product: {
            type: Object,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    user: {
        name: {
            type: String,
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    }
});

module.exports = model('Order', orderSchema);