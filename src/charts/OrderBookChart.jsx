import React, {useMemo} from 'react';
import {AreaClosed, LinePath} from '@vx/shape';
import {curveMonotoneX} from '@vx/curve';
import {scaleLinear} from '@vx/scale';
import {withTooltip} from '@vx/tooltip';
import {LinearGradient} from '@vx/gradient';
import {max, min} from 'd3-array';
import {AxisBottom, AxisLeft, AxisRight} from '@vx/axis';
import {PatternLines} from '@vx/pattern';
import {orderBook} from "../sample-data/orderBook";


// accessors
const getPrice = d => d.price;
const getVolume = d => d.amount;


export default withTooltip(({width, height, margin = { top: 0, right: 0, bottom: 40, left: 40 },}) => {

    if (width < 10) return null;

    const askDataUnstepped = orderBook.asks.sort((a, b) => (a.price > b.price) ? 1 : -1);
    const bidDataUnstepped = orderBook.bids.sort((a, b) => (a.price > b.price) ? 1 : -1);

    const addSteps = (list) => {
        return list.reduceRight(function (acc, d) {
            let curr = [{price: d.price, amount: d.amount}];
            if (acc === 0) return {prev: d, list: curr};
            console.log(acc.prev.price);

            let step = [{price: d.price, amount: acc.prev.amount}];
            let newL = acc.list.concat(step).concat(curr); // step/curr order
            return {prev: d, list: newL};
        }, 0);
    };

    const bidData = addSteps(bidDataUnstepped).list;
    const askData = addSteps(askDataUnstepped).list;

    // bounds
    const xMax = width - margin.right;
    const xMin = margin.left;
    const yMax = height - margin.top - margin.bottom;

    const getMinMax = (func, axisBuffer) => {
        const maxAskVal = (max(askData, func) || 0);
        const minAskVal = (min(askData, func) || 0);
        const maxBidVal = (max(bidData, func) || 0);
        const minBidVal = (min(bidData, func) || 0);
        const maxVal = (maxAskVal > maxBidVal ? maxAskVal : maxBidVal);
        const minVal = (minBidVal < minAskVal ? minBidVal : minAskVal);
        const maxOffset =  maxVal + axisBuffer;
        return [maxOffset, minVal];
    };

    const [maxPriceOffset, minPriceOffset] = getMinMax(getPrice, 0);
    const [maxVolumeOffset, minVolumeOffset] = getMinMax(getVolume, 0);

    const priceScale = useMemo(
        () =>
            scaleLinear({
                range: [xMin, xMax],
                domain: [minPriceOffset, maxPriceOffset],
            }),
        [xMax],
    );

    const volumeScale = useMemo(
        () =>
            scaleLinear({
                range: [yMax, 0 + margin.bottom],
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
                    id="area-gradient3"
                    from="#95ffba"
                    to="#4E756B"
                    fromOpacity={0.25}
                    toOpacity={0.05}
                />
                <PatternLines
                    id="dLines3"
                    height={6}
                    width={6}
                    stroke="var(--bg-color)"
                    strokeWidth={2}
                    orientation={['diagonal']}
                />
                <AreaClosed
                    data={bidData}
                    x={d => priceScale(getPrice(d))}
                    y={d => volumeScale(getVolume(d))}
                    yScale={volumeScale}
                    strokeWidth={1}
                    stroke="transparent"
                    fill="url(#area-gradient3)"
                    curve={curveMonotoneX}
                />
                <AreaClosed
                    data={bidData}
                    x={d => priceScale(getPrice(d))}
                    y={d => volumeScale(getVolume(d))}
                    yScale={volumeScale}
                    strokeWidth={2}
                    stroke="transparent"
                    fill="url(#dLines3)"
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
                    id="area-gradient2"
                    from="#c1796c"
                    to="#785d5d"
                    fromOpacity={0.25}
                    toOpacity={0.05}
                />
                {/* re-use pattern lines ? */}
                <PatternLines
                    id="dLines2"
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
                    fill="url(#area-gradient2)"
                    curve={curveMonotoneX}
                />
                <AreaClosed
                    data={askData}
                    x={d => priceScale(getPrice(d))}
                    y={d => volumeScale(getVolume(d))}
                    yScale={volumeScale}
                    strokeWidth={1}
                    stroke="transparent"
                    fill="url(#dLines2)"
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


                {/* AXIS */}

                <AxisLeft
                    left={margin.left}
                    scale={volumeScale}
                    numTicks={height > 300 ? 10 : 5}
                    hideAxisLine
                    //stroke={'var(--light-blue)'}
                    tickStroke={'var(--light-blue)'}
                    hideZero
                    tickLabelProps={() => ({
                        fill: 'var(--light-blue)',
                        fontSize: 11,
                        fontWeight: 600,
                        textAnchor: 'end',
                        dy: '0.33em',
                        dx: '-0.3em',
                    })}
                />

                <AxisBottom
                    top={yMax}
                    scale={priceScale}
                    numTicks={width > 520 ? 10 : 5}
                    tickFormat={(d) => {return ('$' + d);}}
                    stroke={'var(--light-blue)'}
                    tickStroke={'var(--light-blue)'}
                    tickLabelProps={() => ({
                        fill: 'var(--light-blue)',
                        fontSize: 11,
                        fontWeight: 600,
                        textAnchor: 'middle',
                        dy: '0.1em',
                    })}
                />

                <line x1={xMax} x2={xMax} y1={0} y2={yMax} stroke={'var(--light-blue'} />
                <line x1={xMin} x2={xMin} y1={0} y2={yMax} stroke={'var(--light-blue'} />
                <line x1={xMin} x2={xMax} y1={0} y2={0} stroke={'var(--light-blue'} />

            </svg>
        </div>
    );
});

