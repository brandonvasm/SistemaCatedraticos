import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

export default function StatCard({ title, value, description, icon }: StatCardProps) {
  const isAlert = value === "1" || parseFloat(value) < 3.5;
  
  return (
    <div className="bg-secondary/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-xl">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 
        ${isAlert ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
        {icon}
      </div>
      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-white tracking-tighter">{value}</span>
        <span className="text-gray-500 text-[10px] leading-tight font-medium">{description}</span>
      </div>
    </div>
  );
}