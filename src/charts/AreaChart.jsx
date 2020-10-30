import React, { useMemo, useCallback } from 'react';
import { AreaClosed, Line, LinePath, Bar } from '@vx/shape';
import appleStock, { AppleStock } from '@vx/mock-data/lib/mocks/appleStock';
import { curveMonotoneX } from '@vx/curve';
//import { GridRows, GridColumns } from '@vx/grid';
import { scaleTime, scaleLinear } from '@vx/scale';
import { withTooltip, Tooltip, defaultStyles } from '@vx/tooltip';
//import { WithTooltipProvidedProps } from '@vx/tooltip/lib/enhancers/withTooltip';
import { localPoint } from '@vx/event';
import { LinearGradient } from '@vx/gradient';
import { max, min, extent, bisector } from 'd3-array';
import { timeFormat } from 'd3-time-format';
import { PatternLines } from '@vx/pattern';


const stock = appleStock.slice(1000);
export const background = '#3b6978';
export const background2 = '#204051';
export const accentColor = '#edffea';
export const accentColorDark = 'var(--light-blue)';
const tooltipStyles = {
    ...defaultStyles,
    background: 'var(--light-blue)',
    border: 'none',
    borderRadius: 5,
    color: 'var(--bg-color)',
    fontWeight: 600,
};

// util
const formatDate = timeFormat("%b %d, '%y");

// accessors
const getDate = d => new Date(d.date);
const getStockValue = d => d.close;
const bisectDate = bisector(d => new Date(d.date)).left;



export default withTooltip(
    ({
         width,
         height,
         margin = { top: 0, right: 0, bottom: 0, left: 0 },
         showTooltip,
         hideTooltip,
         tooltipData,
         tooltipTop = 0,
         tooltipLeft = 0,
}) => {
    if (width < 10) return null;

    // bounds
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;


    const maxVal = (max(stock, getStockValue) || 0);
    const minVal = (min(stock, getStockValue) || 0);
    const maxOffset =  maxVal + yMax / 6;
    const minOffset = minVal / 2;


    // scales
    const dateScale = useMemo(
        () =>
            scaleTime({
                range: [0, xMax],
                domain: extent(stock, getDate),
            }),
        [xMax],
    );
    const stockValueScale = useMemo(
        () =>
            scaleLinear({
                range: [yMax, 0],
                domain: [minOffset, maxOffset],
                nice: true,
            }),
        [yMax],
    );

    // tooltip handler
    const handleTooltip = useCallback(
        (event) => {
            const { x } = localPoint(event) || { x: 0 };
            const x0 = dateScale.invert(x);
            const index = bisectDate(stock, x0, 1);
            const d0 = stock[index - 1];
            const d1 = stock[index];
            let d = d0;
            if (d1 && getDate(d1)) {
                d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;
            }
            showTooltip({
                tooltipData: d,
                tooltipLeft: x,
                tooltipTop: stockValueScale(getStockValue(d)),
            });
        },
        [showTooltip, stockValueScale, dateScale],
    );

    return (
        <div style={{float: 'left'}}>
            <svg width={width} height={height}>

                {/*<LinearGradient id="area-background-gradient" from={background} to={background2} />
                <LinearGradient id="area-gradient" from={accentColor} to={accentColor} toOpacity={0.1} />*/}

                <LinearGradient
                    id="area-gradient"
                    from="#6086d6"
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
                data={stock}
                x={d => dateScale(getDate(d))}
                y={d => stockValueScale(getStockValue(d))}
                yScale={stockValueScale}
                strokeWidth={1}
                stroke="transparent"
                fill="url(#area-gradient)"
                curve={curveMonotoneX}
                />
                <AreaClosed
                    data={stock}
                    x={d => dateScale(getDate(d))}
                    y={d => stockValueScale(getStockValue(d))}
                    yScale={stockValueScale}
                    strokeWidth={1}
                    stroke="transparent"
                    fill="url(#dLines)"
                    curve={curveMonotoneX}
                />
                <LinePath
                    data={stock}


                    x={d => dateScale(getDate(d))}
                    y={d => stockValueScale(getStockValue(d))}
                    stroke="#6086d6"
                    strokeOpacity="0.8"
                    strokeWidth={1}
                />
                {tooltipData && (
                    <g>
                        <circle
                            cx={tooltipLeft}
                            cy={tooltipTop}
                            r={4}
                            fill={'var(--text)'}
                            stroke="transparent"
                            strokeWidth={2}
                            pointerEvents="none"
                        />
                    </g>
                )}
            </svg>
            {tooltipData && (
                <div>
                    <Tooltip top={tooltipTop + 5} left={tooltipLeft + 5} style={tooltipStyles}>
                        {`$${getStockValue(tooltipData)}`}
                        <br/>
                        {formatDate(getDate(tooltipData))}
                    </Tooltip>
                </div>
            )}
        </div>
    );
  },
);