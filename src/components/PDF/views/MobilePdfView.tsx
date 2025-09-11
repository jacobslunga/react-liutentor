import ExamPdf from "../ExamPdf";
import type { ExamWithSolutions } from "@/types/exam";
import type { FC } from "react";

interface Props {
  examDetail: ExamWithSolutions;
}

const MobilePdfView: FC<Props> = ({ examDetail }) => {
  return (
    <div className="w-screen h-screen flex md:hidden">
      <ExamPdf pdfUrl={examDetail.exam.pdf_url} />
    </div>
  );
};

export default MobilePdfView;
