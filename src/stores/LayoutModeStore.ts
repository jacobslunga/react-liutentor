import { create } from "zustand";

type LayoutMode = "exam-only" | "exam-with-facit";

type LayoutModeStore = {
  layoutMode: LayoutMode;
  toggleMode: () => void;
};

const useLayoutMode = create<LayoutModeStore>((set) => ({
  layoutMode: "exam-with-facit",
  toggleMode: () =>
    set((state) => ({
      layoutMode:
        state.layoutMode === "exam-only" ? "exam-with-facit" : "exam-only",
    })),
}));

export default useLayoutMode;
