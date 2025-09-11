import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Button } from "../../ui/button";
import ExamPdf from "../ExamPdf";
import type { ExamWithSolutions } from "@/types/exam";
import { useState, type FC } from "react";
import { FileX, MousePointerClick } from "lucide-react";
import { Link } from "react-router-dom";
import SolutionPdf from "@/components/PDF/SolutionPdf";
import { useTranslation } from "@/contexts/TranslationsContext";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  examDetail: ExamWithSolutions;
}

const DesktopView: FC<Props> = ({ examDetail }) => {
  const { t } = useTranslation();
  const [solutionIsBlurred, setSolutionIsBlurred] = useState(true);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={55} minSize={30}>
        <ExamPdf pdfUrl={examDetail.exam.pdf_url} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={45} minSize={20}>
        <>
          {examDetail.solutions.length > 0 ? (
            <>
              {/** Blur overlay */}
              {/* <AnimatePresence>
                  {solutionIsBlurred && (
                    <motion.div
                      className="absolute bg-background/60 backdrop-blur-sm w-full h-full inset-0 z-10 flex flex-col items-center justify-center gap-2 pointer-events-none"
                      initial={{
                        opacity: 1,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      style={{
                        pointerEvents: "none",
                      }}
                    >
                      <p className="font-normal">{t("mouseOverDescription")}</p>
                      <MousePointerClick className="w-7 h-7 mt-2" />
                    </motion.div>
                  )}
                </AnimatePresence> */}
              <SolutionPdf
                pdfUrl={examDetail.solutions[0].pdf_url}
                solutionIsBlurred={solutionIsBlurred}
                setSolutionIsBlurred={setSolutionIsBlurred}
              />
            </>
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
  );
};

export default DesktopView;
