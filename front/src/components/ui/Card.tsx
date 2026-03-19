interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div className={`bg-secondary/30 border border-white/5 backdrop-blur-sm p-5 rounded-2xl shadow-xl ${className}`}>
      {children}
    </div>
  );
}