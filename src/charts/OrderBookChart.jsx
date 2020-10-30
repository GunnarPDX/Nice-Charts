
import React, { useMemo } from 'react';
import { AreaClosed, LinePath, Bar } from '@vx/shape';
import { curveMonotoneX } from '@vx/curve';
import { scaleLinear } from '@vx/scale';
import { withTooltip, Tooltip, defaultStyles } from '@vx/tooltip';
import { LinearGradient } from '@vx/gradient';
import { max, min } from 'd3-array';

import { PatternLines } from '@vx/pattern';
import { orderBook } from "../sample-data/orderBook";


// accessors
const getPrice = d => d.price;
const getVolume = d => d.amount;


export default withTooltip(({width, height, margin = { top: 0, right: 0, bottom: 0, left: 0 },}) => {

    if (width < 10) return null;

    const askData = orderBook.asks;

    const bidData = orderBook.bids;



    if(!askData || !bidData) return null;



    // bounds
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    const getMinMax = (func, axisMax) => {
        const maxAskVal = (max(askData, func) || 0);
        console.log(maxAskVal);
        const minAskVal = (min(askData, func) || 0);
        console.log(minAskVal);
        const maxBidVal = (max(bidData, func) || 0);
        console.log(maxBidVal);
        const minBidVal = (min(bidData, func) || 0);
        console.log(minBidVal);
        const maxVal = (maxAskVal > maxBidVal ? maxAskVal : maxBidVal);
        console.log(maxVal);
        const minVal = (minBidVal < minAskVal ? minBidVal : minAskVal);
        console.log(minVal);
        const maxOffset =  maxVal + axisMax;
        return [maxOffset, minVal];
    };

    const [maxPriceOffset, minPriceOffset] = getMinMax(getPrice, 0);
    const [maxVolumeOffset, minVolumeOffset] = getMinMax(getVolume, 0);


    console.log(minPriceOffset);
    console.log(maxPriceOffset);
    // scales
    const priceScale = useMemo(
        () =>
            scaleLinear({
                range: [0, xMax],
                domain: [minPriceOffset, maxPriceOffset],
                nice: true,
            }),
        [xMax],
    );

    const volumeScale = useMemo(
        () =>
            scaleLinear({
                range: [yMax, 0],
                domain: [minVolumeOffset, maxVolumeOffset],
                nice: true,
            }),
        [yMax],
    );

    return (
        <div style={{float: 'left'}}>
            <svg width={width} height={height}>

                {/* BID */}

                <LinearGradient
                    id="area-gradient"
                    from="#95ffba"
                    to="#6086d6"
                    fromOpacity={0.2}
                    toOpacity={0}
                />
                <PatternLines
                    id="dLines"
                    height={6}
                    width={6}
                    stroke="var(--bg-color)"
                    strokeWidth={0.5}
                    orientation={['diagonal']}
                />
                <AreaClosed
                    data={bidData}
                    x={d => priceScale(getPrice(d))}
                    y={d => volumeScale(getVolume(d))}
                    yScale={volumeScale}
                    strokeWidth={1}
                    stroke="transparent"
                    fill="url(#area-gradient)"
                    curve={curveMonotoneX}
                />
                <AreaClosed
                    data={bidData}
                    x={d => priceScale(getPrice(d))}
                    y={d => volumeScale(getVolume(d))}
                    yScale={volumeScale}
                    strokeWidth={1}
                    stroke="transparent"
                    fill="url(#dLines)"
                    curve={curveMonotoneX}
                />
                <LinePath
                    data={bidData}
                    x={d => priceScale(getPrice(d))}
                    y={d => volumeScale(getVolume(d))}
                    stroke="#95ffba"
                    strokeOpacity="0.8"
                    strokeWidth={1}
                />

                {/* ASK */}

                <LinearGradient
                    id="area-gradient"
                    from="#c1796c"
                    to="#6086d6"
                    fromOpacity={0.2}
                    toOpacity={0}
                />
                <PatternLines
                    id="dLines"
                    height={6}
                    width={6}
                    stroke="var(--bg-color)"
                    strokeWidth={2}
                    orientation={['diagonal']}
                />
                <AreaClosed
                    data={askData}
                    x={d => priceScale(getPrice(d))}
                    y={d => volumeScale(getVolume(d))}
                    yScale={volumeScale}
                    strokeWidth={1}
                    stroke="transparent"
                    fill="url(#area-gradient)"
                    curve={curveMonotoneX}
                />
                <AreaClosed
                    data={askData}
                    x={d => priceScale(getPrice(d))}
                    y={d => volumeScale(getVolume(d))}
                    yScale={volumeScale}
                    strokeWidth={1}
                    stroke="transparent"
                    fill="url(#dLines)"
                    curve={curveMonotoneX}
                />
                <LinePath
                    data={askData}
                    x={d => priceScale(getPrice(d))}
                    y={d => volumeScale(getVolume(d))}
                    stroke="#c1796c"
                    strokeOpacity="0.8"
                    strokeWidth={1}
                />



            </svg>
        </div>
    );
});

