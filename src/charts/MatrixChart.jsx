import React, {useState} from 'react';
import {scaleLinear} from 'd3-scale';
import {XYPlot, XAxis, YAxis, HeatmapSeries, LabelSeries} from 'react-vis';



const HeatmapChart = (props) => {

    const data = props.data;

    const width = 700;
    const height = 250;

    const {min, max} = data.reduce(
        (acc, row) => ({
            min: Math.min(acc.min, row.color),
            max: Math.max(acc.max, row.color)
        }),
        {min: Infinity, max: -Infinity}
    );

    // fixed domain ex: [0, 0.5, 1]
    const exampleColorScale = scaleLinear()
        .domain([min, (min + max) / 2, max])
        .range(['#5275C1', '#2d2b4a', '#c1796c']);
        //['#0098f5', '#c5c6cc', '#e1705a'] <~~ og red/blue

    const yAxisFormatter = (t, i) => {
        let item = data.filter((item) => {
            return item.y === i + 1;
        })[0];

        return (
            <tspan>
                {item.yLabel.toUpperCase()}
            </tspan>
        );
    };

    const xAxisFormatter = (t, i) => {
        let item = data.filter((item) => {
            return item.x === i + 1;
        })[0];

        return (
            <tspan>
                {item.xLabel.toUpperCase()}
            </tspan>
        );
    };

    const marginLeft = 70;
    const marginBottom = 50;

    return (
        <XYPlot width={width} height={height}  margin={{left: marginLeft, bottom: marginBottom}}>
            <XAxis
                tickTotal={3}
                tickFormat={xAxisFormatter}
                top={height - marginBottom + 10}
                tickSizeInner={0}
                style={{
                    line: {stroke: 'var(--light-blue)'},
                    ticks: {stroke: 'var(--light-blue)'},
                    text: {stroke: 'none', fontWeight: 600, fill: 'var(--light-blue)'}
                }}
            />
            <YAxis
                tickTotal={3}
                tickFormat={yAxisFormatter}
                left={-10}
                tickSizeInner={0}
                style={{
                    line: {stroke: 'var(--light-blue)'},
                    ticks: {stroke: 'var(--light-blue)'},
                    text: {stroke: 'none', fontWeight: 600, fill: 'var(--light-blue)'}
                }}
            />
            <HeatmapSeries
                colorType="literal"
                getColor={d => exampleColorScale(d.color)}
                className="heatmap-series"
                data={data}
                style={{
                    stroke: 'var(--bg-color)',
                    strokeWidth: '2px',
                    rectStyle: {
                        rx: 5,
                        ry: 5
                    }
                }}
            />
            <LabelSeries
                style={{pointerEvents: 'none', fill: 'var(--bg-color)', fontWeight: 800}}
                data={data}
                labelAnchorX="middle"
                labelAnchorY="middle"
                getLabel={d => `${d.color}`}
            />
        </XYPlot>
    );

};

export default HeatmapChart;