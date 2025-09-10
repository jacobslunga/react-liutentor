import { type FC, useEffect } from "react";

import { Loader2 } from "lucide-react";
import { useCourseExams } from "@/api/hooks/useCourseExams";
import { useExamDetail } from "@/api/hooks/useExamDetail";
import { useLanguage } from "@/contexts/LanguageContext";
import { useMetadata } from "@/hooks/useMetadata";
import { useParams } from "react-router-dom";
import usePdf from "@/hooks/usePdf";
import ExamPdf from "@/components/PDF/ExamPdf";
import SolutionPdf from "@/components/PDF/SolutionPdf";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

const TentaPage: FC = () => {
  const { language } = useLanguage();
  const exam = usePdf("exam");
  const solution = usePdf("solution");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { courseCode = "", examId = "" } = useParams<{
    courseCode: string;
    examId: string;
  }>();

  const {
    courseData,
    isLoading: examsLoading,
    isError: examsError,
  } = useCourseExams(courseCode);

  const {
    examDetail,
    isLoading: detailLoading,
    isError: detailError,
  } = useExamDetail(Number(examId));
  console.log(examDetail);

  const formatExamDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("sv-SE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const pageTitle =
    examDetail && courseData
      ? `${courseCode} - Tenta ${formatExamDate(examDetail.exam.exam_date)} | ${
          courseData.course_name_eng
        }`
      : `${courseCode} - Tenta ${examId}`;

  const pageDescription =
    examDetail && courseData
      ? `Se tenta för ${courseCode} från ${formatExamDate(
          examDetail.exam.exam_date
        )} - ${courseData.course_name_eng}`
      : `Tenta för ${courseCode}`;

  useMetadata({
    title: pageTitle,
    description: pageDescription,
    keywords: `${courseCode}, tenta, Linköpings Universitet, kurs, LiU, liu, Liu ${
      courseData?.course_name_eng || ""
    }`,
    ogTitle: pageTitle,
    ogDescription: pageDescription,
    ogType: "article",
    twitterCard: "summary",
    twitterTitle: pageTitle,
    twitterDescription: pageDescription,
    robots: "noindex, nofollow",
    canonical: `${window.location.origin}/exam/${courseCode}/${examId}`,
  });

  if (examsLoading || detailLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          {language === "sv" ? "Laddar tenta..." : "Loading exam..."}
        </p>
      </div>
    );
  }

  if (!courseData || !examDetail || examsError || detailError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center w-screen">
      {/** Desktop PDF View */}
      <div className="w-screen h-screen hidden md:flex">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={30}>
            <ExamPdf pdfUrl={examDetail.exam.pdf_url} />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={20}>
            <div className="w-full h-full">
              {examDetail.solutions.length > 0 ? (
                <SolutionPdf pdfUrl={examDetail.solutions[0].pdf_url} />
              ) : (
                <p>No pdf</p>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/** Mobile PDF View */}
      <div className="w-screen h-screen flex md:hidden">
        <ExamPdf pdfUrl={examDetail.exam.pdf_url} />
      </div>
    </div>
  );
};

export default TentaPage;
