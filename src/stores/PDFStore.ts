import { create } from "zustand";

type PdfKey = "exam" | "solution";

type PdfState = {
  scale: number;
  numPages: number;
  rotation: number;
};

type PdfStore = {
  pdfs: Record<PdfKey, PdfState>;
  setScale: (key: PdfKey, scale: number) => void;
  setNumPages: (key: PdfKey, numPages: number) => void;
  setRotation: (key: PdfKey, rotation: number) => void;
};

const initialState: PdfState = { scale: 1.2, numPages: 0, rotation: 0 };

const usePdfStore = create<PdfStore>((set) => ({
  pdfs: {
    exam: initialState,
    solution: initialState,
  },
  setScale: (key, scale) =>
    set((s) => ({
      pdfs: { ...s.pdfs, [key]: { ...s.pdfs[key], scale } },
    })),
  setNumPages: (key, numPages) =>
    set((s) => ({
      pdfs: { ...s.pdfs, [key]: { ...s.pdfs[key], numPages } },
    })),
  setRotation: (key, rotation) =>
    set((s) => ({
      pdfs: { ...s.pdfs, [key]: { ...s.pdfs[key], rotation } },
    })),
}));

export default usePdfStore;
