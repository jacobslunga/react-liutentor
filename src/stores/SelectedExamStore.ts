import { create } from "zustand";
import { type Exam } from "@/types/exam";

type SelectedExamStore = {
  selectedExam: Exam | null;
  setSelectedExam: (newExam: Exam | null) => void;
  clearSelectedExam: () => void;
  isSelected: (id: number) => boolean;
};

const useSelectedExam = create<SelectedExamStore>((set, get) => ({
  selectedExam: null,
  setSelectedExam: (newExam) => set({ selectedExam: newExam }),
  clearSelectedExam: () => set({ selectedExam: null }),
  isSelected: (id) => get().selectedExam?.id === id,
}));

export default useSelectedExam;
