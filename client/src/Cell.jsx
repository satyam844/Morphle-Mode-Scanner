import { model } from "mongoose";
import React, { cloneElement } from "react";
import "./Cell.css";

 function Cell(props){
            return <div 
            id={`${props.isCurr ? "curr" : "" }` }
     className={` cell ${(props.isCaptured && props.isCaptured) ? "captured" : ""}  
                       ${(props.isFocused && props.isCaptured === false) ? "capturing" :""} 
                       ${(props.isCaptured === false && props.isFocused === false) ? "focusing" : ""}`}>
            
    </div>;
 }

 export default Cell;