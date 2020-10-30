import React from "react";
import AreaChart from "./AreaChart";


const PriceChart = ({height, width}) => {

    // TODO: add price high/low and current price...

    return (
        <div>
            <AreaChart height={height} width={width}/>
        </div>
    )

};

export default PriceChart;