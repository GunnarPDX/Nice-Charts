import './App.css';
import MatrixChart from "./charts/MatrixChart";
import React from "react";

function App() {

    let data = JSON.parse( "[{\"color\":0.674977695,\"x\":1,\"xLabel\":\"aapl\",\"y\":1,\"yLabel\":\"amzn\"},{\"color\":0.104192125,\"x\":1,\"xLabel\":\"aapl\",\"y\":2,\"yLabel\":\"tsla\"},{\"color\":0.809616347,\"x\":1,\"xLabel\":\"aapl\",\"y\":3,\"yLabel\":\"nvda\"},{\"color\":0.867990063,\"x\":2,\"xLabel\":\"nvda\",\"y\":1,\"yLabel\":\"amzn\"},{\"color\":0.198672188,\"x\":2,\"xLabel\":\"nvda\",\"y\":2,\"yLabel\":\"tsla\"},{\"color\":0.236184044,\"x\":3,\"xLabel\":\"tsla\",\"y\":1,\"yLabel\":\"amzn\"}]");

    return (
    <div className="App">

      <MatrixChart {...{data: data}}/>

    </div>
  );
}

export default App;
