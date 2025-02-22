// src/components/AnimalsChart.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import animalsData from '../data/data.json';
import AnimalsMap from '../components/AnimalMap';

const AnimalsChart = () => {
  // Custom color palette
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#413ea0', '#a0522d'];

  return (
    <div style={{ width: '100%', height: 500 }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Animal Populations by Location</h2>
      <ResponsiveContainer>
        <BarChart
          data={animalsData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="animal" 
            angle={-45} 
            textAnchor="end" 
            height={70}
            tick={{ fill: '#555' }}
          />
          <YAxis 
            label={{ 
              value: 'Population', 
              angle: -90, 
              position: 'insideLeft', 
              offset: 10,
              style: { fill: '#555' } 
            }} 
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: '20px'
            }}
          />
          <Bar 
            dataKey="quantity" 
            name="Population" 
            fill="#8884d8"
          >
            {
              animalsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))
            }
          </Bar>
        </BarChart>
        <AnimalsMap/>
      </ResponsiveContainer>
    </div>
  );
};

export default AnimalsChart;