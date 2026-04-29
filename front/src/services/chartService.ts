import api from "../api/axios";

export const chartService = {
  getCoursesEvolution: async () => {
    try {
      const response = await api.get('/historical/course-history/evolution/');
      const rawData = response.data;

      if (!Array.isArray(rawData)) {
        console.error("La respuesta no es un array:", rawData);
        return [];
      }

      const semesterMap: { [key: string]: any } = {};

      rawData.forEach((course: any) => {
        if (course.semester_ratings && Array.isArray(course.semester_ratings)) {
          course.semester_ratings.forEach((rating: any) => {
            const label = `${rating.semester_year}-${rating.semester_number}`;
            
            if (!semesterMap[label]) {
              semesterMap[label] = { 
                name: label,
                sortKey: rating.semester_year * 10 + rating.semester_number 
              };
            }
            
            semesterMap[label][course.course_name] = rating.rating;
          });
        }
      });
      return Object.values(semesterMap)
        .sort((a: any, b: any) => a.sortKey - b.sortKey);
    } catch (error) {
      console.error("Error cargando evolución:", error);
      return [];
    }
  },

  getCourseEvolution: async (id: string | number) => {
    try {
      const response = await api.get(`/historical/course-history/${id}/evolution/`);
      return response.data; 
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return { semester_ratings: [] };
      }
      throw error;
    }
  }


};