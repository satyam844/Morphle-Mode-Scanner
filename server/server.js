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

function delay(ms){
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
  
  var queue = [];
  var scanPos = null;
  var nxtPos = null;
  var isFocusing = false;

io.on("connection",async(socket) =>{

    

    function sendRenderingData(){
        socket.emit("renderData",{
            matrix : slabData.matrix,
            currPos : currPos,
            message : message
        })
    }


    var  slabData = await Slab.findOne();
    console.log(slabData);

    var currPos = {
        i : slabData.matrix.length/2,
        j : slabData.matrix[0].length/2
    }
    //  await delay(2000);
    let message = "";

    sendRenderingData();
    socket.on("key",async (key) =>{
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

        // if(!queue.includes(currPos))
            // queue.push(currPos);
            scanPos = currPos;
        if(!isFocusing) {
            isFocusing = true;
            await operation(scanPos);
            isFocusing = false;
            queue.shift();
        }

      console.log(currPos.i+" "+currPos.j);
    });

   async function focus(pos){
         
         if(slabData.matrix[pos.i][pos.j].isCaptured === true){
            return;
        }
         
         message = `Focusing on ${pos.i},${pos.j}`;
         sendRenderingData();
         isFocusing = true;
         await delay(3000);
         slabData.matrix[pos.i][pos.j].isFocused = true;
         await slabData.save();
         isFocusing = false;
         message = `Focused and now Capturing ${pos.i},${pos.j}`;
         sendRenderingData();
        // console.log(pos.i+" "+pos.j);
        
        await delay(2000);
        slabData.matrix[pos.i][pos.j].isCaptured = true;
            await slabData.save();
            message = `Captured ${pos.i},${pos.j}`;
        sendRenderingData();
        }

//    async function capture(pos){
//         if(slabData.matrix[pos.i][pos.j].isCaptured === true){
//             return;
//       }
//       await delay(2000);
//       slabData.matrix[pos.i][pos.j].isCaptured = true;
//          await slabData.save();
//          message = `Captured ${pos.i},${pos.j}`;
//       sendRenderingData();
//     }

    async function operation(pos) {
        console.log("operation: " + pos.i + " " + pos.j);
        await focus(pos);
        // await capture(pos);
    }

});



























