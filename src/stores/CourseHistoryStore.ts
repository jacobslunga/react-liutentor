import { create } from "zustand";

type Course = {
  courseCode: string;
  timestamp: number;
};

type CourseHistory = {
  courses: Course[];
  loadCourses: () => void;
  addCourse: (courseCode: string) => void;
};

const STORAGE_KEY = "savedCourses";

const useCourseHistory = create<CourseHistory>((set) => ({
  courses: [],
  loadCourses: () =>
    set(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed = saved ? (JSON.parse(saved) as Course[]) : [];
      return { courses: parsed };
    }),
  addCourse: (courseCode: string) =>
    set(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      const savedCourses = saved ? (JSON.parse(saved) as Course[]) : [];

      if (savedCourses.find((sc) => sc.courseCode === courseCode)) {
        return { courses: savedCourses };
      }

      const newCourse: Course = { courseCode, timestamp: Date.now() };
      const updated = [newCourse, ...savedCourses];

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { courses: updated };
    }),
}));

export default useCourseHistory;
