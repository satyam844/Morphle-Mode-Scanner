const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const Slab = require("./models/Slab");
const createMatrix = require("./helper-functions/createMatrix");
const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.use(cors());

mongoose.connect("mongodb+srv://Satyam_10:Satyam_10@cluster0.s4lybh3.mongodb.net/slab",() =>{
    console.log("connected to mongoDB atlas");
});

// createMatrix();

async function delay(ms){
    const promise = new Promise((res,rej) => {
      setTimeout(res,ms);
    })
    return promise;
}


const io = socketIo(4000,{
    cors : {
      origin : "http://localhost:3000",
    }
  });

io.on("connection",async(socket) =>{

    var scanPos = null;
    var nxtPos = null;

    console.log(socket.id);

    async function sendRenderingData(){
        socket.emit("renderData",{
            matrix : slabData.matrix,
            currPos : currPos,
            message : message
        })
    }


    var  slabData = await Slab.findOne();
    // console.log(slabData);

    var currPos = {
        i : slabData.matrix.length/2,
        j : slabData.matrix[0].length/2
    }

    let message = "";

    sendRenderingData();


    await socket.on("key",async (key) =>{
        if(key === "ArrowLeft" && currPos.j>0 ){
          currPos.j--;
        }
        else if(key === "ArrowRight" && currPos.j <59 ){
          currPos.j++;
        }
        else if(key ==="ArrowUp" && currPos.i>0){
          currPos.i--;
        }
        else if(key === "ArrowDown" && currPos.i <19){
        currPos.i++;
        }

        sendRenderingData();


        if(scanPos) {
            nxtPos = currPos;
        } else {
            scanPos = currPos;

            while(scanPos) {
                await operation({i: scanPos.i, j: scanPos.j});
                scanPos = nxtPos;
                nxtPos = null;
            }

        }

      console.log(currPos.i+" "+currPos.j);

    });

   async function operation(pos){
         
        //focusing
         if(slabData.matrix[pos.i][pos.j].isCaptured === true){
            return;
        }
         
         message = `Focusing on ${pos.i},${pos.j}`;
         sendRenderingData();
         slabData.matrix[pos.i][pos.j].isFocusing = true;
         await slabData.save();
         sendRenderingData();

         await delay(3000);  // focusing halt operation
         slabData.matrix[pos.i][pos.j].isFocused = true;
         slabData.matrix[pos.i][pos.j].isFocusing = false;
         await slabData.save();

        // capturing
         message = `Focused and now Capturing ${pos.i},${pos.j}`;
         sendRenderingData();

        if (slabData.matrix[pos.i][pos.j].isCaptured) {
            return
        }

        await delay(2000);    // capturing halt operation
        slabData.matrix[pos.i][pos.j].isCaptured = true;
        await slabData.save();
        message = `Captured ${pos.i},${pos.j}`;
        sendRenderingData();

        }

});



























