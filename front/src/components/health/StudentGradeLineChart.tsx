import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { GradePoint } from '../../types/health';

const data: GradePoint[] = [
  { name: 'Prog. I', calif: 4.2 },
  { name: 'Prog. II', calif: 3.8 },
  { name: 'Base Datos', calif: 4.0 },
  { name: 'Redes', calif: 4.5 },
  { name: 'Software', calif: 4.6 },
  { name: 'IA', calif: 3.9 },
];

const StudentGradeLineChart: React.FC = () => (
  <div className="h-72 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 0, right: 30, left: -25, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
        <YAxis domain={[0, 5]} ticks={[0, 2, 5]} axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
        <Tooltip contentStyle={{backgroundColor: '#111622', border: '1px solid #374151'}} />
        <Line 
          type="monotone" 
          dataKey="calif" 
          stroke="#10b981" 
          strokeWidth={3} 
          dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default StudentGradeLineChart;