const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    name:{
        type: String,
        required: [true, 'Why no name?'],
        minlength: 3
    },
    surname:{
        type: String,
        required: [true, 'Surname is required!'],
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(value){
                return /[a-z]+(\.|_)?([a-z0-9]+(\.|_)?)+?[a-z0-9]+@[a-z0-9]+_?[a-z0-9]+\.[a-z]+/.test(value);
            },
            message: function(props){
                return `${props.value} doesn't seem to be an email!`;
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    userConfirmed: {
        type: Boolean,
        default: false
    },
    lastLogin:{
        type: Date
    },
    tokens:[{
        access:{
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
});

module.exports = model('User', userSchema);