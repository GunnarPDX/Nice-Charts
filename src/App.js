import './App.css';
import MatrixChart from "./charts/MatrixChart";
import React from "react";


import PriceChart from "./charts/PriceChart";
import {matrixData} from "./sample-data/matrixData";
import OrderBookChart from "./charts/OrderBookChart";
import CandlestickChart from "./charts/CandlestickChart";




function App() {

    return (
    <div className="App">

      <MatrixChart {...{data: matrixData}}/>

      <br/>

      <PriceChart height={300} width={700}/>

      <br/>

      <OrderBookChart height={400} width={700}/>

      <br/>

      <CandlestickChart/>

    </div>
  );
}

export default App;
