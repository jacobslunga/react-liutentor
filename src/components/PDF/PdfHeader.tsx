import type { Exam } from "@/types/exam";
import type { FC } from "react";
import useSelectedExam from "@/stores/SelectedExamStore";

interface Props {
  exams: Exam[];
}

const PdfHeader: FC<Props> = ({ exams }) => {
  const { selectedExam } = useSelectedExam();

  return (
    <div className="hidden md:flex z-20 fixed w-full flex-row items-center top-0 left-0 right-0 justify-between px-5 h-14 bg-background border-b"></div>
  );
};

export default PdfHeader;
