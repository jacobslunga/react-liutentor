import usePdfStore from "@/stores/PDFStore";

function usePdf(key: "exam" | "solution") {
  const pdf = usePdfStore((s) => s.pdfs[key]);
  const setScale = usePdfStore((s) => s.setScale);
  const setNumPages = usePdfStore((s) => s.setNumPages);
  const setRotation = usePdfStore((s) => s.setRotation);

  return {
    ...pdf,
    setScale: (val: number) => setScale(key, val),
    setNumPages: (val: number) => setNumPages(key, val),
    setRotation: (val: number) => setRotation(key, val),
  };
}

export default usePdf;
