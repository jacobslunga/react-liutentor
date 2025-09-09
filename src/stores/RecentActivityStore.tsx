import React, { createContext, useContext, useEffect, useReducer } from "react";

export interface RecentActivity {
  courseCode: string;
  timestamp: number;
}

interface State {
  recentActivities: RecentActivity[];
}

type Action =
  | { type: "SET"; payload: RecentActivity[] }
  | { type: "ADD"; payload: RecentActivity };

const STORAGE_KEY = "recentActivities_v3";
const STORAGE_VERSION_KEY = "recentActivities_version";
const CURRENT_VERSION = "1.2";

const initialState: State = {
  recentActivities: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET":
      return { ...state, recentActivities: action.payload };
    case "ADD": {
      const existingIndex = state.recentActivities.findIndex(
        (item) => item.courseCode === action.payload.courseCode
      );

      let updated = [...state.recentActivities];
      const activity = {
        ...action.payload,
        timestamp: Date.now(),
      };

      if (existingIndex !== -1) {
        updated[existingIndex] = { ...updated[existingIndex], ...activity };
      } else {
        updated.push(activity);
      }

      updated.sort((a, b) => b.timestamp - a.timestamp);

      localStorage.setItem("recentActivities_v3", JSON.stringify(updated));

      return { ...state, recentActivities: updated };
    }
    default:
      return state;
  }
};

const RecentActivityContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const RecentActivityProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const storedVersion = localStorage.getItem(STORAGE_VERSION_KEY);
    if (storedVersion !== CURRENT_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(STORAGE_VERSION_KEY, CURRENT_VERSION);
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as RecentActivity[];
        dispatch({
          type: "SET",
          payload: parsed.sort((a, b) => b.timestamp - a.timestamp),
        });
      } catch {}
    }
  }, []);

  return (
    <RecentActivityContext.Provider value={{ state, dispatch }}>
      {children}
    </RecentActivityContext.Provider>
  );
};

export const useRecentActivity = () => useContext(RecentActivityContext);
