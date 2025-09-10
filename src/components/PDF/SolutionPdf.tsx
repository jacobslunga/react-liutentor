import { useCallback, type FC } from "react";
import PdfRenderer from "@/components/PDF/PDFRenderer";
import usePdf from "@/hooks/usePdf";

interface Props {
  pdfUrl: string | null;
}

const SolutionPdf: FC<Props> = ({ pdfUrl }) => {
  const { numPages, scale, rotation, setNumPages } = usePdf("solution");

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

export default SolutionPdf;
