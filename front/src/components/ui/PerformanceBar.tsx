interface PerformanceBarProps {
  label: string;
  percentage: number;
}

export default function PerformanceBar({ label, percentage }: PerformanceBarProps) {
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className="w-full group">
      <div className="flex justify-between mb-3 items-end">
        <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors duration-500">
          {label}
        </span>
        
        <span className="text-white text-xs font-black tracking-tighter">
          {safePercentage}
          <span className="text-[9px] text-gray-500 ml-0.5 uppercase">
            %
          </span>
        </span>
      </div>

      <div className="bg-white/[0.03] border border-white/10 h-4 p-[3px] rounded-full overflow-hidden shadow-inner relative backdrop-blur-sm">
        
        <div 
          className="relative h-full rounded-full transition-all duration-1000 ease-out overflow-hidden" 
          style={{ width: `${safePercentage}%` }}
        >

          <div className="absolute inset-0 bg-yellow-400" />
          
   
          <div className="absolute top-0 left-0 w-full h-[1.5px] bg-white/30" />
          
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>

  
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}