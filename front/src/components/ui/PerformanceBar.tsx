interface PerformanceBarProps {
  label: string;
  percentage: number;
}

export default function PerformanceBar({ label, percentage }: PerformanceBarProps) {
  return (
    <div className="w-full group">
      <div className="flex justify-between mb-3 items-end">

        <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors duration-500">
          {label}
        </span>
        
        <span className="text-white text-xs font-black tracking-tighter">
          {percentage}
          <span className="text-[9px] text-gray-500 ml-0.5 uppercase">
            %
          </span>
        </span>
      </div>

      <div className="glass-card h-4 p-[3px] rounded-full overflow-hidden shadow-inner border-white/10 relative">
        
        <div 
          className="relative h-full rounded-full transition-all duration-1000 ease-out overflow-hidden" 
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.4)]" />
          
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-white/40" />
          
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}