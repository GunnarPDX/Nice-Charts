import React from "react";
import AreaChart from "./AreaChart";


const PriceChart = ({height, width}) => {

    // TODO: add price high/low and current price...

    return (
        <div style={{
            paddingTop: 20,
            paddingBottom: 20
        }}>
            <div style={{
                borderTop: '1px dashed var(--muted-blue)',
                borderBottom: '1px dashed var(--muted-blue)',
                height: height,
                width: width
            }}>

            <AreaChart height={height} width={width}/>

            </div>

        </div>
    )

};

export default PriceChart;