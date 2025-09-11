import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Button } from "../../ui/button";
import ExamPdf from "../ExamPdf";
import type { ExamWithSolutions } from "@/types/exam";
import type { FC } from "react";
import { FileX } from "lucide-react";
import { Link } from "react-router-dom";
import SolutionPdf from "@/components/PDF/SolutionPdf";
import { useTranslation } from "@/contexts/TranslationsContext";

interface Props {
  examDetail: ExamWithSolutions;
}

const DesktopView: FC<Props> = ({ examDetail }) => {
  const { t } = useTranslation();

  return (
    <div className="w-screen h-screen hidden md:flex">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={55} minSize={30}>
          <ExamPdf pdfUrl={examDetail.exam.pdf_url} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={45} minSize={20}>
          <>
            {examDetail.solutions.length > 0 ? (
              <SolutionPdf pdfUrl={examDetail.solutions[0].pdf_url} />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                <FileX className="w-14 h-14 text-gray-400 dark:text-gray-800" />
                <p className="font-normal">{t("noFacitAvailable")}</p>
                <p className="text-sm text-center text-foreground/70 max-w-full md:max-w-[50%]">
                  {t("noFacitAvailableDescription")}
                </p>

                <Link to="/upload-exams">
                  <Button variant="secondary" size="sm">
                    {t("moreExamsBtn")}
                  </Button>
                </Link>
              </div>
            )}
          </>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default DesktopView;
