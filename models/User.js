const {Schema, model} = require('mongoose');
const { ObjectID } = require('mongodb');
const Order = require('../models/Order');
const Product = require('../models/Product');
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
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpiration: {
        type: String
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
    quantity = quantity || 1;

    const existingProductIndex = this.cart.items.findIndex(item => {
        return item.productId.toString() === product._id.toString();
    });

    if(existingProductIndex >= 0){
        this.cart.items[existingProductIndex].quantity += Number(quantity);
    }else{
        this.cart.items.push({
            productId: product,
            quantity: Number(quantity)
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

userSchema.methods.recommendedItems = function(){
    var user = this;

    return Order.find({ 'user.userId': user._id})
        .sort({issuedDate: -1})
        .limit(1)
        .populate('items.product.categoryId')
        .then(doc => {
            // console.log(JSON.stringify(doc, undefined, 3));
            const favCategories = doc[0]
                                    .items
                                    .filter(item => item.product.categoryId !== undefined && item.product.categoryId !== null)
                                    .map(item => item.product.categoryId);
            const favorite = new ObjectID(favCategories[0]);
            return Product.find({categoryId: favorite}).limit(3).populate('categoryId');
        })
        .then(products => {
            return products;
        });
};

userSchema.methods.itemsBoughtByOthers = function(recommendedItems){
    var user = this;

    return Order.find({
            'user.userId': { $ne: user._id},
            'items.product.categoryId': new ObjectID(recommendedItems[0].categoryId._id)
        })
        .then(res => {
            const itemsArray = res.map(order => {
                return order.items.map(item =>{
                    return item.product;
                });
            });
            return itemsArray.flat().slice(0, 4);
        })
        .catch(err => {
            throw err;
        });
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

userSchema.statics.generateResetPasswordToken = function(email, token) {

    return User.findOne({email})
                .then(user => {
                    if(!user){
                        return Promise.reject({httpStatusCode: 404, message: 'No users found'});
                    }
                    user.resetPasswordToken = token;
                    // const expiration = new Date().getTime() + 3600000;
                    user.resetPasswordExpiration = new Date().getTime() + 3600000;

                    return user.save();
                })
                .then(user => Promise.resolve(user))
                .catch(err => Promise.reject(err));
};

userSchema.statics.newPassword = function(email, newPassword){
    return genHash(newPassword)
            .then(hash => {
                return User.updateOne({email}, {password: hash, resetPasswordToken: undefined, resetPasswordExpiration: undefined});
            })
            .then(user => {
                if(user.ok == 1)
                    return Promise.resolve(user);
                else
                    return Promise.reject();
            })
            .catch(err => Promise.reject());
};

const User = model('User', userSchema);

module.exports = User;