const mongoose = require('mongoose');
const cellState = {
    isFocused : 0,
    isCaptured : 0
};


const SlabSchema = new mongoose.Schema({
    matrix : [[cellState]]
})

const Slab = mongoose.model('slabs',SlabSchema);


module.exports = Slab;