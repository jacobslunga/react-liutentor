import { ClockIcon, SearchIcon, XIcon } from "@primer/octicons-react";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { CornerUpRight } from "lucide-react";
import useCourseHistory from "@/stores/CourseHistoryStore";
import { useLanguage } from "@/contexts/LanguageContext";
import useSWR from "swr";
import { useTranslation } from "@/contexts/TranslationsContext";

interface CourseSearchDropdownProps {
  placeholder?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const fetchCourseCodes = async (): Promise<string[]> => {
  const res = await fetch("/courseCodes.json");
  if (!res.ok) throw new Error("Failed to load course codes");
  return res.json();
};

const CourseSearchDropdown: React.FC<CourseSearchDropdownProps> = ({
  placeholder,
  className = "",
  size = "md",
}) => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { courses, addCourse, loadCourses } = useCourseHistory();

  const [courseCode, setCourseCode] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: courseCodes = [], isLoading } = useSWR(
    "courseCodes",
    fetchCourseCodes,
    {
      dedupingInterval: 1000 * 60 * 60 * 24,
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    loadCourses();
  }, []);

  const recentCourseCodes = courses
    .map((course) => course.courseCode)
    .slice(0, 4);

  useEffect(() => {
    if (courseCode.trim()) {
      setSuggestions(
        courseCodes.filter((code) =>
          code.toUpperCase().includes(courseCode.toUpperCase())
        )
      );
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
    }
  }, [courseCode, courseCodes]);

  const scrollToSuggestion = (index: number) => {
    if (suggestionsRef.current?.children[index]) {
      const selectedElement = suggestionsRef.current.children[
        index
      ] as HTMLElement;
      selectedElement.scrollIntoView({
        behavior: "instant",
        block: "nearest",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isShowingSuggestions = courseCode.trim() && suggestions.length > 0;
    const isShowingRecent = !courseCode.trim() && recentCourseCodes.length > 0;
    const activeList = isShowingSuggestions
      ? suggestions.slice(0, 10)
      : isShowingRecent
      ? recentCourseCodes
      : [];

    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && activeList.length > 0) {
        handleSelectCourse(activeList[selectedIndex]);
      } else {
        handleSelectCourse(courseCode);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = Math.min(selectedIndex + 1, activeList.length - 1);
      setSelectedIndex(newIndex);
      scrollToSuggestion(newIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex = Math.max(selectedIndex - 1, 0);
      setSelectedIndex(newIndex);
      scrollToSuggestion(newIndex);
    } else if (e.key === "Escape") {
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const handleSelectCourse = (course: string) => {
    const searchCode = course.toUpperCase().trim();
    if (!searchCode) return;

    addCourse(searchCode);

    setCourseCode("");
    inputRef.current?.blur();

    navigate(
      pathname.includes("stats")
        ? `/search/${searchCode}/stats`
        : `/search/${searchCode}`
    );
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      setSelectedIndex(-1);
    }, 150);
  };

  const sizeClasses = {
    sm: "text-xs p-2",
    md: "text-sm p-2.5",
    lg: "text-base p-3",
  };
  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const showRecentList =
    isFocused && !courseCode.trim() && recentCourseCodes.length > 0;
  const showSuggestionsList =
    isFocused && courseCode.trim() && suggestions.length > 0;

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex items-center">
        <SearchIcon
          className={`${iconSizes[size]} text-muted-foreground absolute left-3 pointer-events-none`}
        />
        <input
          ref={inputRef}
          placeholder={placeholder || t("searchCoursePlaceholder")}
          value={courseCode.toUpperCase()}
          onChange={(e) => setCourseCode(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full ${sizeClasses[size]} pl-10 pr-10 bg-input text-foreground outline-none ring-offset-background rounded-full transition-all duration-200`}
        />
        {courseCode && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onClick={() => {
              setCourseCode("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
          >
            <XIcon
              className={`${iconSizes[size]} text-muted-foreground hover:text-foreground transition-colors`}
            />
          </button>
        )}
      </div>

      {(showRecentList ||
        showSuggestionsList ||
        (isFocused && isLoading && !suggestions.length)) && (
        <div
          ref={suggestionsRef}
          className="absolute w-full left-0 mt-2 bg-background border border-border shadow-lg z-60 max-h-72 rounded-md overflow-y-auto text-sm"
        >
          {isLoading && !suggestions.length && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              {language === "sv" ? "Laddar kurser..." : "Loading courses..."}
            </div>
          )}

          {showRecentList && (
            <>
              <div className="px-3 pt-3 pb-1 text-muted-foreground font-medium text-xs">
                {t("recentSearches")}
              </div>
              {recentCourseCodes.map((suggestion, index) => (
                <div
                  key={`recent-${suggestion}`}
                  className={`flex items-center px-3 py-2 cursor-pointer transition-colors duration-150 ${
                    index === selectedIndex
                      ? "bg-muted text-foreground"
                      : "hover:bg-muted/50"
                  }`}
                  onMouseDown={() => handleSelectCourse(suggestion)}
                >
                  <ClockIcon className="w-4 h-4 mr-2 opacity-70" />
                  <span className="flex-1">{suggestion}</span>
                  <CornerUpRight className="w-4 h-4 opacity-50" />
                </div>
              ))}
            </>
          )}

          {showSuggestionsList && (
            <>
              <div className="px-3 pt-3 pb-1 text-muted-foreground font-medium text-xs">
                {t("allCourses")}
              </div>
              {suggestions.slice(0, 10).map((suggestion, index) => (
                <div
                  key={suggestion}
                  className={`flex items-center px-3 py-2 cursor-pointer transition-colors duration-150 ${
                    index === selectedIndex
                      ? "bg-muted text-foreground"
                      : "hover:bg-muted/50"
                  }`}
                  onMouseDown={() => handleSelectCourse(suggestion)}
                >
                  <span className="flex-1 font-normal">{suggestion}</span>
                  <CornerUpRight className="w-4 h-4 opacity-50" />
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseSearchDropdown;
