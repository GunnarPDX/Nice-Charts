import React, {Component} from 'react';

import {XYPlot, XAxis, YAxis, HeatmapSeries, Hint, LabelSeries} from 'react-vis';

export default class HeatmapChart extends Component {
    state = {
        value: false
    };

    data = [
        {x: 1, y: 0, color: '#ff65f9'},
        {x: 1, y: 5, color: '#7780ff'},
        {x: 1, y: 10, color: '#1609ff'},
        {x: 1, y: 15, color: '#5962ff'},
        {x: 2, y: 0, color: '#3a35ff'},
        {x: 2, y: 5, color: '#5388ff'},
        {x: 2, y: 10, color: '#2eacff'},
        {x: 2, y: 15, color: '#627bff'},
        {x: 3, y: 0, color: '#83baff'},
        {x: 3, y: 5, color: '#3b2cff'},
        {x: 3, y: 10, color: '#5a68ff'},
        {x: 3, y: 15, color: '#857dff'}
    ];

    myFormatter = (t, i) => {
        return (<tspan>
            <tspan x="0" dy="1em">M</tspan>
            <tspan x="0" dy="1em">{t}</tspan>
        </tspan>);
    };

    render() {
        const {value} = this.state;
        return (
            <XYPlot width={600} height={600}>
                <XAxis tickFormat={this.myFormatter} />
                <YAxis />
                <HeatmapSeries
                    colorType="literal"
                    className="heatmap-series"
                    onValueMouseOver={v => this.setState({value: v})}
                    onSeriesMouseOut={v => this.setState({value: false})}
                    data={this.data}
                    style={{
                        stroke: 'white',
                        strokeWidth: '2px',
                        rectStyle: {
                            rx: 10,
                            ry: 10
                        }
                    }}
                />
                <LabelSeries
                    style={{pointerEvents: 'none'}}
                    data={this.data}
                    labelAnchorX="middle"
                    labelAnchorY="baseline"
                    getLabel={d => `${d.color}`}
                />
                {/* value !== false && <Hint value={value} /> */}
            </XYPlot>
        );
    }
}