type Props = {
  courses: string[];
};

export const CoursesBadges = ({ courses }: Props) => {
  return (
    <div className="flex flex-wrap gap-2">
      {courses.map((c, i) => (
        <span
          key={i}
          className="bg-slate-700 text-xs px-2 py-1 rounded-md"
        >
          {c}
        </span>
      ))}
    </div>
  );
};