interface CardProps {
  name: string;
  isSelected: boolean;
  onClick: () => void;
}

export const Card = ({ name, isSelected, onClick }: CardProps) => (
  <button
    onClick={onClick}
    className={`p-5 text-left transition-all duration-300 w-full relative overflow-hidden ${
      isSelected 
      ? "bg-yellow-400 border-yellow-500 shadow-xl shadow-yellow-400/20 scale-[1.05] rounded-[1.8rem] z-10" 
      : "glass-card hover:bg-white/10 hover:border-white/20 shadow-sm"
    }`}
  >
    <div className="relative z-10">
      <h3 className={`text-[11px] font-black uppercase tracking-tight transition-colors ${
        isSelected ? "text-black" : "text-white"
      }`}>
        {name}
      </h3>
      <p className={`text-[9px] font-bold mt-1 uppercase transition-colors ${
        isSelected ? "text-black/60" : "text-gray-400"
      }`}>
        {status}
      </p>
    </div>
  </button>
);