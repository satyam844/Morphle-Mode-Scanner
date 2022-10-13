const mongoose = require('mongoose');
const cellState = {
    isFocusing: false,
    isFocused : false,
    isCaptured : false
};


const SlabSchema = new mongoose.Schema({
    matrix : [[cellState]]
})

const Slab = mongoose.model('slabs',SlabSchema);


module.exports = Slab;