const {Schema, model} = require('mongoose');
const colors = require('colors');
const genHash = require('../utils/genPasswordHash');
const comparePassword = require('../utils/comparePassword');

const userSchema = new Schema({
    name:{
        type: String,
        required: [true, 'Why no name?'],
        minlength: 3
    },
    surname:{
        type: String,
        required: [true, 'Surname is required!'],
        minlength: [3, 'Surname must be minimum of 3 characters']
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
                required: true,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
});



userSchema.methods.addToCart = function(product, quantity) {
    const existingProductIndex = this.cart.items.findIndex(item => {
        return item.productId.toString() === product._id.toString();
    });

    if(existingProductIndex >= 0){
        this.cart.items[existingProductIndex].quantity += Number(quantity);
    }else{
        this.cart.items.push({
            productId: product,
            quantity
        });
    }

    return this.save();
};

userSchema.methods.removeItem = function(itemId){
    const newItems = this.cart.items.filter(item => item._id.toString() !== itemId);

    this.cart.items = newItems;

    return this.save();
};

userSchema.methods.clearItems = function(){
    this.cart.items = [];
    return this.save();
};

userSchema.statics.login = function(email, password){
    
    let _id;
    return User.findOne({email})
        .then(doc => {
            if(!doc) return Promise.reject('Username or password is invalid');

            _id = doc._id.toString();

            return comparePassword(password, doc.password);
        })
        .then(result => Promise.resolve(_id))
        .catch(err => Promise.reject(err));
}

userSchema.methods.signup = function(){
    var user = this;

    return User.findOne({email: user.email})
        .then(doc => {
            if(doc) return Promise.reject('User already exists');

            // return bcrypt.genSalt(9, (err, salt) => {
            //     bcrypt.hash(user.password, salt, (err, hash) => {
            //         user.password = hash;
            //         return user.save();
            //     });
            // });
            return genHash(user.password);
        })
        .then(hash => {
            user.password = hash;
            return user.save();
        })
        .then(user => Promise.resolve('You have successfully signed up'))
        .catch(err => Promise.reject(err));
};

const User = model('User', userSchema);

module.exports = User;