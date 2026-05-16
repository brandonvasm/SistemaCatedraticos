import { Star } from "lucide-react";

export const renderStars = (rating: number, size = 14) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(
        <Star key={i} size={size} fill="currentColor" className="text-yellow-400" />
      );
    } else if (i - rating < 1) {
      stars.push(
        <Star key={i} size={size} fill="currentColor" className="text-yellow-400 opacity-50" />
      );
    } else {
      stars.push(
        <Star key={i} size={size} className="text-gray-600" />
      );
    }
  }

  return stars;
};