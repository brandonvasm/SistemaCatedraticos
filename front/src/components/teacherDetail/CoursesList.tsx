export default function CoursesList() {
  return (
    <div className="bg-[#1e293b] p-6 rounded-xl mb-6">
      <h2 className="mb-4">Cursos</h2>

      <div className="grid md:grid-cols-3 gap-4">

        <div className="bg-slate-700 p-4 rounded-xl">
          <p>Cálculo I</p>
          <p className="text-yellow-400">4.9</p>
        </div>

        <div className="bg-slate-700 p-4 rounded-xl">
          <p>Cálculo II</p>
          <p className="text-yellow-400">4.7</p>
        </div>

      </div>
    </div>
  );
}