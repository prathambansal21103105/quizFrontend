import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomPieChart = ({scores}) => {
  let correct = 0;
  let incorrect = 0;
  for(let i=0;i<scores.length;i++){
    if(scores[i]===0){
      incorrect+=1;
    }
    else{
      correct+=1;
    }
  }
  const data = [
    { name: 'Correct', value: correct },
    { name: 'Incorrect', value: incorrect },
  ];

  const COLORS = ['#325c74', '#767f76']; // Blue Grey

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomPieChart;
