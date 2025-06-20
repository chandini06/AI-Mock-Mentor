// Performance.js
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const interviewData = [
  { date: '2025-06-10', score: 2.0, duration: '10 min' },
  { date: '2025-06-12', score: 4.5, duration: '12 min' },
  { date: '2025-06-14', score: 6.0, duration: '15 min' },
  { date: '2025-06-16', score: 7.5, duration: '13 min' },
];

const Performance = () => {
  const averageScore = (
    interviewData.reduce((total, item) => total + item.score, 0) /
    interviewData.length
  ).toFixed(2);

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h2>Performance Summary</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Date</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Score</th>
            <th style={{ border: '1px solid #ccc', padding: '10px' }}>Duration</th>
          </tr>
        </thead>
        <tbody>
          {interviewData.map((attempt, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{attempt.date}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{attempt.score}</td>
              <td style={{ border: '1px solid #ccc', padding: '10px' }}>{attempt.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginBottom: '20px' }}>
        <strong>Average Score:</strong> {averageScore} / 10
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={interviewData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#007bff" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Performance;
