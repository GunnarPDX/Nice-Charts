import React from 'react';
import {scaleLinear} from 'd3-scale';
import {XYPlot, XAxis, YAxis, HeatmapSeries, LabelSeries} from 'react-vis';


const HeatmapChart = () => {

    const data = [
        {x: 1, y: 1, color: 0.809616347/*'#ff65f9'*/, xLabel: 'aapl', yLabel: 'amzn'},
        {x: 1, y: 2, color: 0.104192125/*'#7780ff'*/, xLabel: 'aapl', yLabel: 'tsla'},
        {x: 1, y: 3, color: 0.809616347/*'#1609ff'*/, xLabel: 'aapl', yLabel: 'nvda'},

        {x: 2, y: 1, color: 0.867990063/*'#3a35ff'*/, xLabel: 'nvda', yLabel: 'amzn'},
        {x: 2, y: 2, color: 0.198672188/*'#5388ff'*/, xLabel: 'nvda', yLabel: 'tsla'},

        {x: 3, y: 1, color: 0.236184044/*'#83baff'*/, xLabel: 'tsla', yLabel: 'amzn'},
    ];

    const exampleColorScale = scaleLinear()
        .domain([0, 0.5, 1])
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