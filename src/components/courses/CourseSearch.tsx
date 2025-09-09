import { Clock, CornerUpRight, X } from "lucide-react";
import React, {
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useRecentActivity } from "@/stores/RecentActivityStore";
import useSWR from "swr";
import { useTranslation } from "@/contexts/TranslationsContext";
import { useVirtualizer } from "@tanstack/react-virtual";

const typewriterCourses: string[] = [
  "723G70",
  "725G28",
  "725G53",
  "729G17",
  "732G01",
  "732G20",
  "TATA24",
  "TATA32",
  "TATA41",
  "TAMS11",
  "TAMS38",
  "TAOP24",
  "TAOP52",
  "TDP004",
  "TDP015",
  "TDP030",
  "TEAE01",
  "TFYA13",
  "TMHL07",
  "TMME12",
  "TMMI46",
  "TPPE13",
  "TPPE98",
  "TNIU19",
  "TNIU22",
  "TSRT12",
  "TSRT22",
  "TSEI04",
  "TSEA28",
  "TSDT18",
];

interface CourseSearchProps {
  setFocusInput: React.Dispatch<React.SetStateAction<boolean>>;
  searchMethod: string;
  setSearchMethod: React.Dispatch<React.SetStateAction<string>>;
}

const fetchCourseCodes = async (): Promise<string[]> => {
  const res = await fetch("/courseCodes.json");
  if (!res.ok) throw new Error("Failed to load course codes");
  return res.json();
};

const CourseSearch: React.FC<CourseSearchProps> = ({
  setFocusInput,
  searchMethod,
  setSearchMethod,
}) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { state: recentState, dispatch } = useRecentActivity();
  const { t } = useTranslation();

  const [courseCode, setCourseCode] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const [typed, setTyped] = useState("");
  const [exIndex, setExIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const listParentRef = useRef<HTMLDivElement>(null);

  const { data: courseCodes = [], isLoading } = useSWR(
    "courseCodes",
    fetchCourseCodes,
    { dedupingInterval: 1000 * 60 * 60 * 24, revalidateOnFocus: false }
  );

  const exampleCourses = useMemo(
    () => typewriterCourses.slice(0, 20),
    [typewriterCourses]
  );
  const shuffledExamples = useMemo(
    () => [...exampleCourses].sort(() => Math.random() - 0.5),
    [exampleCourses]
  );

  useEffect(() => {
    if (courseCode) return;

    const current = shuffledExamples[exIndex] || "";
    const doneTyping = charIndex === current.length && !deleting;
    const doneDeleting = charIndex === 0 && deleting;
    const speed = deleting ? 30 : 55;
    const pause = doneTyping ? 1200 : doneDeleting ? 500 : 0;

    const timer = setTimeout(() => {
      if (doneTyping) {
        setDeleting(true);
      } else if (doneDeleting) {
        setDeleting(false);

        let nextIndex = exIndex;
        while (nextIndex === exIndex && shuffledExamples.length > 1) {
          nextIndex = Math.floor(Math.random() * shuffledExamples.length);
        }
        setExIndex(nextIndex);
      } else {
        setCharIndex((c) => c + (deleting ? -1 : 1));
      }

      const nextCharIndex = doneDeleting ? 0 : charIndex + (deleting ? -1 : 1);
      setTyped(current.slice(0, nextCharIndex));
    }, pause || speed);

    return () => clearTimeout(timer);
  }, [courseCode, exIndex, charIndex, deleting, shuffledExamples]);

  const upperCourseCodes = useMemo(
    () => courseCodes.map((c) => c.toUpperCase()),
    [courseCodes]
  );

  useEffect(() => {
    const q = courseCode.toUpperCase().trim();
    if (!q) {
      setShowSuggestions(false);
      return;
    }
    setShowSuggestions(true);
    startTransition(() => {
      const filtered = upperCourseCodes
        .filter((code) => code.includes(q))
        .slice(0, 60);
      setSuggestions(filtered);
      setSelectedIndex(-1);
    });
  }, [courseCode, upperCourseCodes]);

  const scrollToSuggestion = (index: number) => {
    if (!suggestionsRef.current) return;
    const els = suggestionsRef.current.children;
    if (!els || !els[index]) return;
    (els[index] as HTMLElement).scrollIntoView({
      behavior: "instant",
      block: "nearest",
    });
  };

  const handleSelectCourse = (course: string) => {
    const searchCode = course.toUpperCase();
    if (!searchCode) return;

    dispatch({
      type: "ADD",
      payload: {
        courseCode: searchCode,
        timestamp: Date.now(),
      },
    });

    setCourseCode("");
    setShowSuggestions(false);
    navigate(
      searchMethod === "stats"
        ? `/search/${searchCode}/stats`
        : `/search/${searchCode}`
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (selectedIndex >= 0 && suggestions.length > 0)
        handleSelectCourse(suggestions[selectedIndex]);
      else handleSelectCourse(courseCode);
      setShowSuggestions(false);
    } else if (e.key === "ArrowDown") {
      const newIndex = Math.min(
        selectedIndex + 1,
        recentState.recentActivities.length + suggestions.length - 1
      );
      setSelectedIndex(newIndex);
      scrollToSuggestion(newIndex);
    } else if (e.key === "ArrowUp") {
      const newIndex = Math.max(selectedIndex - 1, 0);
      setSelectedIndex(newIndex);
      scrollToSuggestion(newIndex);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const rowVirtualizer = useVirtualizer({
    count: suggestions.length,
    getScrollElement: () => listParentRef.current,
    estimateSize: () => 36,
    overscan: 6,
  });

  return (
    <div className="relative w-full">
      <div className="w-full relative flex flex-row items-center justify-center px-2">
        <Select
          defaultValue="tentor"
          onOpenChange={(open) => {
            if (!open) requestAnimationFrame(() => inputRef.current?.focus());
          }}
          onValueChange={(value) => {
            setSearchMethod(value);
            setFocusInput(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
        >
          <SelectTrigger className="shrink-0 w-[120px] transition-colors duration-200 ring-0 focus-visible:ring-0 shadow-none rounded-full text-foreground/60 hover:text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tentor">Tentor</SelectItem>
            <SelectItem value="stats">Statistik</SelectItem>
          </SelectContent>
        </Select>

        <div className="shrink-0 h-[25px] w-[1px] bg-foreground/10 ml-4" />

        <input
          placeholder={
            language === "sv" ? `Sök efter ${typed}` : `Search for ${typed}`
          }
          ref={inputRef}
          value={courseCode.toUpperCase()}
          onChange={(e) => setCourseCode(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-w-0 w-full font-normal p-4 border-none bg-transparent text-sm text-foreground/80 outline-none"
          autoFocus
          onFocus={() => setFocusInput(true)}
          onBlur={() => setFocusInput(false)}
        />

        {courseCode && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => setCourseCode("")}
            aria-label="Clear search"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
      </div>

      {showSuggestions &&
        (recentState.recentActivities.length > 0 || suggestions.length > 0) && (
          <div className="absolute w-full left-0 mt-3 bg-background border shadow-md z-40 max-h-72 rounded-md overflow-hidden text-sm will-change-transform">
            <div className="relative">
              {isLoading && (
                <div className="mt-2 absolute left-3 text-sm text-muted-foreground">
                  Laddar kurser...
                </div>
              )}

              {recentState.recentActivities.length > 0 && (
                <div ref={suggestionsRef}>
                  <div className="px-3 pt-3 pb-1 text-muted-foreground font-medium">
                    {t("recentSearches")}
                  </div>
                  {recentState.recentActivities
                    .slice(0, 4)
                    .map((activity, index) => (
                      <div
                        key={`recent-${activity.courseCode}`}
                        className={`flex items-center px-3 py-2 cursor-pointer ${
                          index === selectedIndex
                            ? "bg-muted text-foreground"
                            : "hover:bg-muted/50"
                        } transition-colors`}
                        onMouseDown={() =>
                          handleSelectCourse(activity.courseCode)
                        }
                      >
                        <Clock className="w-4 h-4 mr-2 opacity-70" />
                        <span className="flex-1">{activity.courseCode}</span>
                        <CornerUpRight className="w-4 h-4 opacity-50" />
                      </div>
                    ))}
                </div>
              )}

              {suggestions.length > 0 && (
                <>
                  {recentState.recentActivities.length > 0 && (
                    <div className="border-t mx-2 my-1" />
                  )}
                  <div className="px-3 pt-3 pb-1 text-muted-foreground font-medium">
                    {t("allCourses")}
                  </div>
                  <div ref={listParentRef} className="overflow-y-auto max-h-56">
                    <div
                      style={{
                        height: rowVirtualizer.getTotalSize(),
                        position: "relative",
                      }}
                    >
                      {rowVirtualizer.getVirtualItems().map((v) => {
                        const suggestion = suggestions[v.index];
                        const isSelected =
                          v.index + recentState.recentActivities.length ===
                          selectedIndex;
                        return (
                          <div
                            key={suggestion}
                            className={`flex items-center px-3 py-2 cursor-pointer ${
                              isSelected
                                ? "bg-muted text-foreground"
                                : "hover:bg-muted/50"
                            } transition-colors`}
                            onMouseDown={() => handleSelectCourse(suggestion)}
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: v.size,
                              transform: `translateY(${v.start}px)`,
                            }}
                          >
                            <span className="flex-1 font-normal">
                              {suggestion}
                            </span>
                            <CornerUpRight className="w-4 h-4 opacity-50" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default CourseSearch;
