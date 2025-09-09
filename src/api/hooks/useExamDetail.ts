import useSWR from "swr";
import { ExamsAPI } from "@/api/exams";
import { type ExamDetail, type ExamWithSolutions } from "@/types/exam";

export const useExamDetail = (examId: string | number | null): ExamDetail => {
  const { data, error } = useSWR<ExamWithSolutions>(
    examId ? `examDetail/${examId}` : null,
    () => ExamsAPI.getExamById(examId!)
  );

  return {
    examDetail: data || null,
    isLoading: !error && !data,
    isError: !!error,
  };
};
