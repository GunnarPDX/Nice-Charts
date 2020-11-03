import React from "react";
import { Bar } from '@vx/shape';
import { Group } from '@vx/group';
import { withTooltip, Tooltip } from '@vx/tooltip';
import { LinearGradient } from '@vx/gradient';
import { GridRows, GridColumns } from '@vx/grid';
import { AxisLeft, AxisBottom, AxisRight } from '@vx/axis';
import { scaleTime, scaleLinear, scaleBand } from '@vx/scale';
import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';
import {PatternLines} from '@vx/pattern';

import {StockOHCLV} from "../sample-data/ohlcvData";

import {max, min} from 'd3-array';

const formatPrice = format('$,.2f');
const formatNumber = format(',.0f');
const formatTime = timeFormat('%I:%M%p');
const getHighValue = d => d.high;
const getLowValue = d => d.low;
const getVolume = d => d.volume;

export default withTooltip(() => {

    const data = StockOHCLV.slice(300);

    //add direction (red ~> false) or (green ~> true) to quotes
    const quotes = data.map((d) => {
        d.direction = d.open >= d.close;
        d.date = new Date(d.date);
        return d;
    });

    console.log(quotes);

    const start = quotes[0].date;
    const end = quotes[quotes.length - 1].date;

    const maxHighPrice = (max(quotes, getHighValue) || 0);
    const minLowPrice = (min(quotes, getLowValue) || 0);
    const maxVolume = (max(quotes, getVolume) || 0);

    const margin = {
        top: 0,
        left: 0,
        right: 60,
        bottom: 40
    };

    const width = 700;
    const height = 400;

    const xMin = margin.left;
    const xMax = width - margin.right - 5;
    const yMin = margin.top;
    const yMax = height - margin.bottom;


    const xScale = scaleBand({
        range: [0, width - 5 - margin.right],
        domain: quotes.map(b => b.date),
        padding: 0.3
    });

    const timeScale = scaleTime({
        range: [0, width - margin.right - margin.left ],
        domain: [start, end]
    });
    const yScale = scaleLinear({
        range: [height - margin.bottom - margin.top, 20],
        domain: [minLowPrice - 3, maxHighPrice]
    });

    const volumeHeight = (height - margin.bottom) * 0.25;
    const yVolumeScale = scaleLinear({
        range: [volumeHeight, 0],
        domain: [0, maxVolume]
    });

    return (
        <div style={{float: 'left'}}>
            <svg width={width} height={height}>
                <LinearGradient
                    id="green-fill"
                    from="#95ffba"
                    to="#95ffba"
                    fromOpacity={0.20}
                    toOpacity={0.20}
                />
                <LinearGradient
                    id="red-fill"
                    from="#c1796c"
                    to="#c1796c"
                    fromOpacity={0.20}
                    toOpacity={0.20}
                />
                <PatternLines
                    id="fill-lines"
                    height={6}
                    width={6}
                    stroke="var(--bg-color)"
                    strokeWidth={1}
                    orientation={['diagonal']}
                />
                <Group top={margin.top} left={margin.left}>

                    <GridRows
                        width={width - margin.right}
                        height={height}
                        scale={yScale}
                        strokeDasharray={2.5}
                        stroke="var(--muted-blue)"
                    />
                    <GridColumns
                        numTicks={width > 520 ? 7 : 4}
                        width={width}
                        height={height - margin.bottom}
                        scale={timeScale}
                        strokeDasharray={2.5}
                        stroke="var(--muted-blue)"
                    />
                </Group>
                {quotes.map(b => {
                    return (
                        <g key={`b-${b.date}`}>
                            <line
                                x1={xScale(b.date) + xScale.bandwidth() / 2}
                                x2={xScale(b.date) + xScale.bandwidth() / 2}
                                y1={yScale(b.high)}
                                y2={b.direction ? yScale(b.open) : yScale(b.close)}
                                stroke={b.direction ? "var(--green)" : "var(--red)"}
                                strokeWidth={1}
                            />
                            <line
                                x1={xScale(b.date) + xScale.bandwidth() / 2}
                                x2={xScale(b.date) + xScale.bandwidth() / 2}
                                y1={b.direction ? yScale(b.close) : yScale(b.open)}
                                y2={yScale(b.low)}
                                stroke={b.direction ? "var(--green)" : "var(--red)"}
                                strokeWidth={1}
                            />
                            <Bar
                                data={b}
                                width={xScale.bandwidth()}
                                height={
                                    b.direction
                                        ? yScale(b.close) - yScale(b.open)
                                        : yScale(b.open) - yScale(b.close)
                                }
                                fill={b.direction ? 'url(#green-fill)' : 'url(#red-fill)'}
                                stroke={b.direction ? "var(--green)" : "var(--red)"}
                                strokeWidth={1}
                                x={xScale(b.date)}
                                y={b.direction ? yScale(b.open) : yScale(b.close)}
                            />
                            {/* // Adds diagonal lines to fill
                            <Bar
                                data={b}
                                width={xScale.bandwidth()}
                                height={
                                    b.direction
                                        ? yScale(b.close) - yScale(b.open)
                                        : yScale(b.open) - yScale(b.close)
                                }
                                fill={'url(#fill-lines)'}
                                x={xScale(b.date)}
                                stroke={b.direction ? "var(--green)" : "var(--red)"}
                                strokeWidth={1}
                                y={b.direction ? yScale(b.open) : yScale(b.close)}
                            />
                            */}

                        </g>
                    );
                })}
                <Group top={height - margin.bottom - volumeHeight}>

                </Group>
                <AxisRight
                    left={width - margin.right}
                    scale={yScale}
                    //hideAxisLine
                    stroke={'var(--light-blue)'}
                    //hideTickStroke
                    tickStroke={'var(--light-blue)'}
                    hideZero
                    tickFormat={formatPrice}
                    //tickLength={0}
                    tickLabelProps={() => ({
                        fill: 'var(--light-blue)',
                        fontSize: 11,
                        fontWeight: 600,
                        textAnchor: 'start',
                        dy: '0.33em',
                        dx: '0.33em',
                    })}
                />
                <AxisBottom
                    top={height - margin.bottom}
                    scale={timeScale}
                    //hideAxisLine
                    stroke={'var(--light-blue)'}
                    //hideTickStroke
                    tickStroke={'var(--light-blue)'}
                    hideZero
                    numTicks={width > 520 ? 7 : 4}
                    tickFormat={formatTime}
                    tickLabelProps={() => ({
                        fill: 'var(--light-blue)',
                        fontSize: 11,
                        fontWeight: 600,
                        textAnchor: 'middle',
                        dy: '0.1em',
                    })}
                />


                <line x1={xMax + 5} x2={xMax + 5} y1={0} y2={yMax} stroke={'var(--light-blue'} />
                {/*
                <line x1={width} x2={width} y1={0} y2={yMax} stroke={'var(--light-blue'} />
                */}
                <line x1={xMin} x2={xMin} y1={0} y2={yMax} stroke={'var(--light-blue'} />
                <line x1={xMin} x2={xMax + 5} y1={0} y2={0} stroke={'var(--light-blue'} />

            </svg>

        </div>
    );
});