import './App.css';
import Cell from "./Cell";
import socketIOClient from "socket.io-client";
import {useEffect,useState,useRef} from 'react';


const socket = socketIOClient.connect("http://localhost:4000");

function App() {
//  const socket = useRef();
  const [slabMatrix,setSlabMatrix] = useState([]);
  const[message,setMessage] = useState("");
  const [currPos,setCurrPos] = useState({
    i : 0,
    j : 0
  }
  );
  
  useEffect(() =>{
    // socket.current = socketIOClient.connect("http://localhost:4000");
     socket.on("renderData",(data) => {
      console.log(data);
      setSlabMatrix(data.matrix);
      setMessage(data.message);
      setCurrPos(data.currPos);
      window.addEventListener("keydown",handleKeyDown);
     });

  },[]);
       
    function handleKeyDown({key}){

      const dir = ["ArrowUp","ArrowDown","ArrowRight","ArrowLeft"];
      console.log(key);
      if(!dir.includes(key)){
        return;
      }

     moveCurr(key);
    }
    function moveCurr(key){
           socket.emit("key",key);
           
    }

  return (
    <div className="App">
     <div className='slab'>
       
       {
        slabMatrix.map((row, idxI) => {
          return (
            <div key={Math.random()}>{row.map((col, idxJ)=> {
            return <Cell key={Math.random()}
                      isCurr = { (currPos.i === idxI && currPos.j === idxJ) }
                      
                      isFocused = {(col.isFocused)}
                      isCaptured = {(col.isCaptured)}
                      isFocusing = {(col.isFocusing)}
                      
                      />
              })}
              </div>
          )
        } )
       }

     </div>
     <h2>{message}</h2>

    </div>
  );
}

export default App;
