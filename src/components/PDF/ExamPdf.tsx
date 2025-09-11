import { useCallback, type FC } from "react";
import PdfRenderer from "./PdfRenderer";
import usePdf from "@/hooks/usePdf";

interface Props {
  pdfUrl: string | null;
}

const ExamPdf: FC<Props> = ({ pdfUrl }) => {
  const { numPages, scale, rotation, setNumPages } = usePdf("exam");

  const onLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => setNumPages(numPages),
    []
  );

  return (
    <div className="w-full h-full">
      <PdfRenderer
        scale={scale}
        rotation={rotation}
        onLoadSuccess={onLoadSuccess}
        numPages={numPages}
        pdfUrl={pdfUrl}
      />
    </div>
  );
};

export default ExamPdf;
