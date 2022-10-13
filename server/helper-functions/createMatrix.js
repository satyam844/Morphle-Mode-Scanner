const mongoose = require("mongoose");
const Slab = require("../models/Slab");

function createMatrix() {
    let matrix = [];

    for(let i = 0; i < 20 ;i++) {
        let row = [];
        for(let j = 0; j < 60; j++) {
            row.push({
                isFocused: 0,
                isCaptured: 0
            });
        }

        matrix.push(row);
    }

    const x = new Slab({
        matrix : matrix
    });

    x.save();
}

module.exports = createMatrix;