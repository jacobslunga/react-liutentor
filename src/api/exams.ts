import { type CourseExamResponse, type ExamWithSolutions } from "@/types/exam";
import apiClient from "./client";

export const ExamsAPI = {
  getCourseExams: async (courseCode: string): Promise<CourseExamResponse> => {
    try {
      const res = await apiClient.get(`/courses/${courseCode}/exams`);
      return res.data;
    } catch (err: any) {
      console.error("Failed to fetch course exams:", err);
      throw new Error("Could not fetch course exams");
    }
  },

  getExamById: async (examId: string | number): Promise<ExamWithSolutions> => {
    try {
      const res = await apiClient.get(`/exams/${examId}`);
      return res.data;
    } catch (err: any) {
      console.error("Failed to fetch exam details:", err);
      throw new Error("Could not fetch exam details");
    }
  },
};
