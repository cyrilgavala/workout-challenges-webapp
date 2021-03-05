import React from "react";
import {CartesianGrid, Line, LineChart, Tooltip, Legend, XAxis, YAxis, ResponsiveContainer} from 'recharts';

export default class CustomLineChart extends React.Component {

  render() {
    if (this.props.data.length > 0) {
      const lines = this.props.labels.map(i => {
        return <Line key={i.label} type="monotone" dataKey={i.label} strokeWidth={3} stroke={i.color} yAxisId={0}/>
      })
      return <div className={"chart-wrapper"}>
        <h3 className={"chart-title"}>Challenge progress</h3>
        <ResponsiveContainer>
          <LineChart
            width={window.innerWidth - 100}
            height={400}
            data={this.props.data}
            margin={{top: 10, right: 50, left: 20, bottom: 0}}
          >
            <XAxis dataKey={"date"} tick={{fill: 'white'}} tickFormatter={o => new Date(o).toLocaleDateString()}/>
            <YAxis yAxisId={0} tick={{fill: 'white'}} allowDataOverflow/>
            <Tooltip isAnimationActive={false} labelFormatter={(o) => new Date(o).toLocaleDateString()}/>
            <Legend/>
            <CartesianGrid stroke="#fff"/>
            {lines}
          </LineChart>
        </ResponsiveContainer>
      </div>
    } else {
      return <div className={"loading-wrapper"}>
        No data
      </div>
    }
  }
}