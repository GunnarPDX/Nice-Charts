import './App.css';
import MatrixChart from "./charts/MatrixChart";
import React from "react";


import PriceChart from "./charts/PriceChart";
import {matrixData} from "./sample-data/matrixData";
import OrderBookChart from "./charts/OrderBookChart";




function App() {

    return (
    <div className="App">

      <MatrixChart {...{data: matrixData}}/>

      <br/>

      <PriceChart height={400} width={700}/>

      <br/>

      <OrderBookChart height={400} width={700}/>

    </div>
  );
}

export default App;
