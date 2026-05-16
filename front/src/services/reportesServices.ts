import api from "../api/axios";

export const reportesServices = {

  descargarReporte: async (endpoint: string) => {

    try {

      const response = await api.get(
        `/reports/${endpoint}/`,
        {
          responseType: "blob",
          withCredentials: true,
        }
      );

      return response.data;

    } catch (error) {

      console.error(
        "Error al descargar reporte:",
        error
      );

      throw error;
    }
  },

  descargarTopCursos: async (
    semesterId: number,
    facultyId: number
  ) => {

    const response = await api.get(
      `/reports/curses-top-reports/?semester=${semesterId}&faculty=${facultyId}`,
      {
        responseType: "blob",
      }
    );

    return response.data;
  },

  descargarEvolucionCursos: async (
    facultyId: number
  ) => {

    const response = await api.get(
      `/reports/courses-evolution-reports/?faculty=${facultyId}`,
      {
        responseType: "blob",
      }
    );

    return response.data;
  },

  descargarReporteArchivos: async (
    facultyId: number
  ) => {

    const response = await api.get(
      `/reports/files-reports/?faculty=${facultyId}`,
      {
        responseType: "blob",
      }
    );

    return response.data;
  },

  generarReporteGeneral: async (
    facultyId: number
  ) => {

    const response = await api.get(
      `/reports/general-reports/?faculty=${facultyId}`,
      {
        responseType: "blob",
      }
    );

    return response.data;
  },

};