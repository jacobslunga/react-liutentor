import { type CourseExamResponse } from "@/types/exam";

import { ExamsAPI } from "@/api/exams";
import useSWR from "swr";

export const useCourseExams = (courseCode: string | null) => {
  const { data, error, isValidating, mutate } = useSWR<CourseExamResponse>(
    courseCode ? `courseExams/${courseCode}` : null,
    () => ExamsAPI.getCourseExams(courseCode!)
  );

  return {
    courseData: data,
    isLoading: !error && !data,
    isError: !!error,
    mutate,
    isValidating,
  };
};
