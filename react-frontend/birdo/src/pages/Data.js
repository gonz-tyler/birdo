import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import animalsData from '../data/data.json';
import AnimalsMap from '../components/AnimalMap';
import { Box, Card, Typography } from '@mui/material';
import { motion } from "framer-motion";
import { Spa } from '@mui/icons-material';

const AnimalsChart = () => {
  // Custom color palette
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#413ea0', '#a0522d'];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #e8f5e9, #c8e6c9)',
        py: 8,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated floating leaves */}
      <Box sx={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -100, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Spa sx={{ fontSize: 40, color: '#2e7d32', opacity: 0.3 }} />
          </motion.div>
        ))}
      </Box>
      <Card
        sx={{
          p: 4,
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          maxWidth: 900,
          width: '90%',
          textAlign: 'center',
          position: 'relative',
          overflow: 'visible'
        }}
      >
        <Box sx={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)' }}>
          <Spa sx={{ fontSize: 80, color: '#2e7d32' }} />
        </Box>
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            color: '#1b5e20',
            textAlign: 'center',
            '&:after': {
              content: '""',
              display: 'block',
              width: 60,
              height: 4,
              backgroundColor: '#81c784',
              margin: '16px auto'
            }
          }}
        >
          Animal Populations by Location
        </Typography>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={animalsData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            />
            <Legend 
              wrapperStyle={{
                paddingTop: '20px'
              }}
            />
            <Bar dataKey="quantity" name="Population" fill="#8884d8">
              {
                animalsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))
              }
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <Box sx={{ mt: 4 }}>
          <AnimalsMap />
        </Box>
      </Card>
    </Box>
  );
};

export default AnimalsChart;
