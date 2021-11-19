import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

export default function CustomLineChart(props) {

  if (props.data.length > 0) {
    const lines = props.labels.map(i => {
      return <Line key={i.label} type="monotone" dataKey={i.label} strokeWidth={3} stroke={i.color} yAxisId={0}/>
    })
    return <div className={"chart-wrapper"}>
      <ResponsiveContainer>
        <LineChart
          width={window.innerWidth - 100}
          height={400}
          data={props.data}
          margin={{top: 20, right: 50, left: 20, bottom: 10}}
        >
          <XAxis dataKey={"date"} tick={{fill: 'white'}} tickFormatter={o => new Date(o).toLocaleDateString()}/>
          <YAxis yAxisId={0} tick={{fill: 'white'}}/>
          <Tooltip isAnimationActive={false} labelFormatter={(o) => new Date(o).toLocaleDateString()}/>
          <Legend/>
          <CartesianGrid stroke="#fff"/>
          {lines}
        </LineChart>
      </ResponsiveContainer>
    </div>
  } else {
    return <div className={"no-data"}>No data</div>
  }
}