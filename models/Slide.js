const { model, Schema } = require('mongoose');

const slideSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    hyperlink:{
        type: String
    },
    imgUrl:{
        type: String,
        required: true
    },
    shown:{
        type: Boolean,
        required:true,
    },
    order:{
        type: Number,
        required: true
    }
});

module.exports = model('slides', slideSchema);