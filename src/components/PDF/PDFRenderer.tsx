import { Document, Page, pdfjs } from "react-pdf";
import { useState, type FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";

type PDFError = "no-url" | "no-load";

interface PDFRendererProps {
  pdfUrl: string;
  scale: number;
  rotation: number;
  numPages: number;
  onLoadSuccess: ({ numPages }: { numPages: number }) => void;
}

interface PDFErrorProps {
  error: PDFError;
}

/**
 * Responsible for rendering any PDF based on pdfUrl
 * @param pdfUrl        - External link or base64 representation
 * @param scale         - Initial scale of the PDF
 * @param rotation      - Initial rotation of the PDF
 * @param onLoadSuccess - Callback after rendering the PDF
 */
const PDFRenderer: FC<PDFRendererProps> = ({
  pdfUrl,
  scale = 1,
  rotation = 1,
  numPages,
  onLoadSuccess,
}) => {
  if (!pdfUrl) {
    return <PDFError error="no-url" />;
  }

  const { effectiveTheme } = useTheme();

  const [pageRotations, setPageRotations] = useState<Record<number, number>>(
    {}
  );

  const handlePageLoadSuccess = (
    page: pdfjs.PDFPageProxy,
    pageNumber: number
  ) => {
    const nativeRotation = page.rotate || 0;
    setPageRotations((prev) => ({ ...prev, [pageNumber]: nativeRotation }));
  };

  const isDark = effectiveTheme === "dark";

  return (
    <div
      className="w-full h-full overscroll-auto"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div
        className="w-full h-full"
        style={{
          filter: isDark ? "invert(0.98) brightness(1) contrast(0.8)" : "none",
          backgroundColor: "transparent",
        }}
      >
        <Document
          file={pdfUrl}
          onLoadSuccess={onLoadSuccess}
          className="w-full h-full flex items-center justify-start space-y-5 flex-col"
        >
          {Array.from({ length: numPages || 0 }, (_, i) => (
            <Page
              key={i + 1}
              pageNumber={i + 1}
              rotate={(pageRotations[i + 1] || 0) + rotation}
              scale={scale}
              onLoadSuccess={(page) => handlePageLoadSuccess(page, i + 1)}
              className="pdf-page"
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))}
        </Document>
      </div>
    </div>
  );
};

const PDFError: FC<PDFErrorProps> = ({ error }) => {
  return <div>{error}</div>;
};

export default PDFRenderer;
