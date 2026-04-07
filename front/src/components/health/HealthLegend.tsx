import React from 'react';
import type { LegendItem } from '../../types/health';

const items: LegendItem[] = [
  { label: 'Baja observación docente', color: 'bg-red-500' },
  { label: 'Calidad docente', color: 'bg-yellow-500' },
  { label: 'Calificación promedio de estudiantes', color: 'bg-green-500' },
];

const HealthLegend: React.FC = () => (
  <div className="space-y-4">
    {items.map((item, i) => (
      <div key={i} className="flex items-center gap-3">
        <div className={`w-4 h-4 rounded-sm ${item.color}`} />
        <span className="text-gray-300 text-sm font-medium">{item.label}</span>
      </div>
    ))}
  </div>
);

export default HealthLegend;