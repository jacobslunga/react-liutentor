import { useCallback, useMemo, useState, type FC } from "react";
import PdfRenderer from "./PdfRenderer";
import { motion } from "framer-motion";
import usePdf from "@/hooks/usePdf";

interface Props {
  pdfUrl: string | null;
}

const SolutionPdf: FC<Props> = ({ pdfUrl }) => {
  const { numPages, scale, rotation, setNumPages } = usePdf("solution");
  const [solutionIsBlurred, setSolutionIsBlurred] = useState(true);

  const onLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => setNumPages(numPages),
    []
  );

  const facitVariants = useMemo(
    () => ({
      hidden: { x: "100%", opacity: 0, filter: "blur(8px)" },
      visible: { x: "0%", opacity: 1, filter: "blur(0px)" },
    }),
    []
  );

  return (
    <div
      className="w-full h-full relative"
      onMouseEnter={() => setSolutionIsBlurred(false)}
      onMouseLeave={() => setSolutionIsBlurred(true)}
    >
      <motion.div
        className="absolute bg-background/80 backdrop-blur-sm w-full h-full top-0 right-0"
        variants={facitVariants}
        initial="hidden"
        animate={solutionIsBlurred ? "visible" : "hidden"}
        style={{ pointerEvents: solutionIsBlurred ? "auto" : "none" }}
        transition={{
          x: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
          opacity: { duration: 0.3 },
          filter: { duration: 0.3 },
        }}
      />
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
