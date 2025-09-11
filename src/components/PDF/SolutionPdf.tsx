import { useCallback, type FC } from "react";
import PdfRenderer from "./PdfRenderer";
import usePdf from "@/hooks/usePdf";

interface Props {
  pdfUrl: string | null;
  solutionIsBlurred: boolean;
  setSolutionIsBlurred: React.Dispatch<React.SetStateAction<boolean>>;
}

const SolutionPdf: FC<Props> = ({
  pdfUrl,
  solutionIsBlurred,
  setSolutionIsBlurred,
}) => {
  const { numPages, scale, rotation, setNumPages } = usePdf("solution");

  const onLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => setNumPages(numPages),
    []
  );

  return (
    <div
      className="w-full h-full"
      onMouseEnter={() => setSolutionIsBlurred(false)}
      onMouseLeave={() => setSolutionIsBlurred(true)}
    >
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
