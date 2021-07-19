import React from 'react';
import { Group } from '@visx/group';
import { curveBasis } from '@visx/curve';
import { LinePath } from '@visx/shape';
import { Threshold } from '@visx/threshold';
import { scaleTime, scaleLinear } from '@visx/scale';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { GridRows, GridColumns } from '@visx/grid';
import cityTemperature, { CityTemperature } from '@visx/mock-data/lib/mocks/cityTemperature';

//export const background = '#f3f3f3';

// accessors
const date = (d) => new Date(d.date).valueOf();
const ny = (d) => Number(d['New York']);
const sf = (d) => Number(d['San Francisco']);

// scales
const timeScale = scaleTime({
  domain: [Math.min(...cityTemperature.map(date)), Math.max(...cityTemperature.map(date))],
});
const temperatureScale = scaleLinear({
  domain: [
    Math.min(...cityTemperature.map(d => Math.min(ny(d), sf(d)))),
    Math.max(...cityTemperature.map(d => Math.max(ny(d), sf(d)))),
  ],
  nice: true,
});

const defaultMargin = { top: 40, right: 30, bottom: 50, left: 40 };

const ThresholdChart = ({ width, height, margin = defaultMargin }) => {
  if (width < 10) return null;

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  timeScale.range([0, xMax]);
  temperatureScale.range([yMax, 0]);

  return (
    <div>
      <svg width={width} height={height}>

        <Group left={margin.left} top={margin.top}>
          <GridRows scale={temperatureScale} width={xMax} height={yMax} stroke="var(--muted-blue)" strokeDasharray={2.5}/>
          <GridColumns scale={timeScale} width={xMax} height={yMax} stroke="var(--muted-blue)" strokeDasharray={2.5}/>
          <line x1={xMax} x2={xMax} y1={0} y2={yMax} stroke="var(--light-blue)" />
          <line x1={0} x2={xMax} y1={0} y2={0} stroke="var(--light-blue)" />
          <AxisBottom
            top={yMax}
            scale={timeScale}
            numTicks={width > 520 ? 10 : 5}
            stroke={'var(--light-blue)'}
            tickStroke={'var(--light-blue)'}
            tickLabelProps={() => ({
              fill: 'var(--light-blue)',
              fontSize: 8,
              fontWeight: 600,
              textAnchor: 'start',
              dy: '0.33em',
              dx: '0.33em',
            })}
          />
          <AxisLeft
            scale={temperatureScale}
            stroke={'var(--light-blue)'}
            tickStroke={'var(--light-blue)'}
            tickLabelProps={() => ({
              fill: 'var(--light-blue)',
              fontSize: 11,
              fontWeight: 600,
              textAnchor: 'start',
              dy: '0.33em',
              dx: '-1.5em',
            })}
          />

          <Threshold
            id={`${Math.random()}`}
            data={cityTemperature}
            x={d => timeScale(date(d)) ?? 0}
            y0={d => temperatureScale(ny(d)) ?? 0}
            y1={d => temperatureScale(sf(d)) ?? 0}
            clipAboveTo={0}
            clipBelowTo={yMax}
            curve={curveBasis}
            belowAreaProps={{
            fill: 'var(--red)',
            fillOpacity: 0.3,
          }}
            aboveAreaProps={{
            fill: 'var(--green)',
            fillOpacity: 0.3,
          }}
            />
            <LinePath
              data={cityTemperature}
              curve={curveBasis}
              x={d => timeScale(date(d)) ?? 0}
              y={d => temperatureScale(sf(d)) ?? 0}
              stroke="var(--muted-blue)"
            />
            <LinePath
              data={cityTemperature}
              curve={curveBasis}
              x={d => timeScale(date(d)) ?? 0}
              y={d => temperatureScale(ny(d)) ?? 0}
              stroke="var(--muted-blue)"
              strokeWidth={0.8}
            />
        </Group>
      </svg>
    </div>
);
};

export default ThresholdChart;
