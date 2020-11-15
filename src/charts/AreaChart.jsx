import React, {useMemo, useCallback} from 'react';
import {AreaClosed, LinePath, Bar} from '@vx/shape';
import {curveMonotoneX} from '@vx/curve';
import {scaleTime, scaleLinear} from '@vx/scale';
import {withTooltip, Tooltip, defaultStyles} from '@vx/tooltip';
import {localPoint} from '@vx/event';
import {LinearGradient} from '@vx/gradient';
import {max, min, extent, bisector} from 'd3-array';
import {timeFormat} from 'd3-time-format';
import {PatternLines} from '@vx/pattern';


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
         data,
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


    const maxVal = (max(data, getStockValue) || 0);
    const minVal = (min(data, getStockValue) || 0);
    const maxOffset =  maxVal + yMax / 6;
    const minOffset = minVal / 1.1;


    // scales
    const dateScale = useMemo(
        () =>
            scaleTime({
                range: [0, xMax],
                domain: extent(data, getDate),
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
            const index = bisectDate(data, x0, 1);
            const d0 = data[index - 1];
            const d1 = data[index];
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

                <LinearGradient
                    id="area-gradient"
                    from="var(--light-blue)"
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
                data={data}
                x={d => dateScale(getDate(d))}
                y={d => stockValueScale(getStockValue(d))}
                yScale={stockValueScale}
                strokeWidth={1}
                stroke="transparent"
                fill="url(#area-gradient)"
                curve={curveMonotoneX}
                />
                <AreaClosed
                    data={data}
                    x={d => dateScale(getDate(d))}
                    y={d => stockValueScale(getStockValue(d))}
                    yScale={stockValueScale}
                    strokeWidth={1}
                    stroke="transparent"
                    fill="url(#dLines)"
                    curve={curveMonotoneX}
                />
                <LinePath
                    data={data}


                    x={d => dateScale(getDate(d))}
                    y={d => stockValueScale(getStockValue(d))}
                    stroke="var(--light-blue)"
                    strokeOpacity="0.8"
                    strokeWidth={1}
                />
                <Bar
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    fill="transparent"
                    rx={14}
                    onTouchStart={handleTooltip}
                    onTouchMove={handleTooltip}
                    onMouseMove={handleTooltip}
                    onMouseLeave={() => hideTooltip()}
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