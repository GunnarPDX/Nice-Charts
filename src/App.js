import './App.css';
import MatrixChart from "./charts/MatrixChart";
import React from "react";


import PriceChart from "./charts/PriceChart";
import {matrixData} from "./sample-data/matrixData";
import OrderBookChart from "./charts/OrderBookChart";
import CandlestickChart from "./charts/CandlestickChart";
import {StockOHCLV} from "./sample-data/ohlcvData";
import appleStock from '@vx/mock-data/lib/mocks/appleStock';

const CandleStickData = StockOHCLV.slice(300);
const stock = appleStock.slice(1000);


function App() {

    return (
    <div className="App">

      <MatrixChart data={matrixData}/>

      <br/>

      <PriceChart height={300} width={700} data={stock}/>

      <br/>

      <OrderBookChart height={400} width={700}/>

      <br/>

      <CandlestickChart height={400} width={700} data={CandleStickData} />

    </div>
  );
}

export default App;
