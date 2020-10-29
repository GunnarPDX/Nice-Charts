import React, {useState} from 'react';
import {scaleLinear} from 'd3-scale';
import {XYPlot, XAxis, YAxis, HeatmapSeries, LabelSeries} from 'react-vis';



const HeatmapChart = (props) => {

    //console.log(props.data);

    const data = props.data;

    /*
    let data1 = [
        {color: 0.674977695, x: 1, xLabel: "aapl", y: 1, yLabel: "amzn"},
        {color: 0.104192125, x: 1, xLabel: "aapl", y: 2, yLabel: "tsla"},
        {color: 0.809616347, x: 1, xLabel: "aapl", y: 3, yLabel: "nvda"},

        {color: 0.867990063, x: 2, xLabel: "nvda", y: 1, yLabel: "amzn"},
        {color: 0.198672188, x: 2, xLabel: "nvda", y: 2, yLabel: "tsla"},

        {color: 0.236184044, x: 3, xLabel: "tsla", y: 1, yLabel: "amzn"}
    ];

    const data2 = [
        {x: 1, y: 1, color: 0.809616347, xLabel: 'aapl', yLabel: 'amzn'},
        {x: 1, y: 2, color: 0.104192125, xLabel: 'aapl', yLabel: 'tsla'},
        {x: 1, y: 3, color: 0.809616347, xLabel: 'aapl', yLabel: 'nvda'},

        {x: 2, y: 1, color: 0.867990063, xLabel: 'nvda', yLabel: 'amzn'},
        {x: 2, y: 2, color: 0.198672188, xLabel: 'nvda', yLabel: 'tsla'},

        {x: 3, y: 1, color: 0.236184044, xLabel: 'tsla', yLabel: 'amzn'},
    ];
     */

    const {min, max} = data.reduce(
        (acc, row) => ({
            min: Math.min(acc.min, row.color),
            max: Math.max(acc.max, row.color)
        }),
        {min: Infinity, max: -Infinity}
    );

    // fixed domain ex: [0, 0.5, 1]
    const exampleColorScale = scaleLinear()
        .domain([min, (min + max) / 2, max]) // TODO: bring back dynamic domain for uasge with downside correlation !
        .range(['#0098f5', '#c5c6cc', '#e1705a']);

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


    return (
        <XYPlot width={700} height={300}  margin={{left: 100, bottom: 100}}>
            <XAxis
                tickTotal={3}
                tickFormat={xAxisFormatter}
                top={300 - 100 + 10}
                tickSizeInner={0}
                style={{
                    line: {stroke: 'white'},
                    ticks: {stroke: 'white'},
                    text: {stroke: 'none', fontWeight: 600, fill: 'white'}
                }}
            />
            <YAxis
                tickTotal={3}
                tickFormat={yAxisFormatter}
                left={-10}
                tickSizeInner={0}
                style={{
                    line: {stroke: 'white'},
                    ticks: {stroke: 'white'},
                    text: {stroke: 'none', fontWeight: 600, fill: 'white'}
                }}
            />
            <HeatmapSeries
                colorType="literal"
                getColor={d => exampleColorScale(d.color)}
                className="heatmap-series"
                data={data}
                style={{
                    stroke: '#111111',
                    strokeWidth: '2px',
                    rectStyle: {
                        rx: 5,
                        ry: 5
                    }
                }}
            />
            <LabelSeries
                style={{pointerEvents: 'none', fill: '#111111', fontWeight: 800}}
                data={data}
                labelAnchorX="middle"
                labelAnchorY="middle"
                getLabel={d => `${d.color}`}
            />
        </XYPlot>
    );

};

export default HeatmapChart;