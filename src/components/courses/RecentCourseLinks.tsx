import { useEffect, useState } from "react";

import { ArrowUpRightIcon } from "@primer/octicons-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useRecentActivity } from "@/stores/RecentActivityStore";

interface Props {
  searchMethod: string;
}

const RecentCourseLinks = ({ searchMethod }: Props) => {
  const {
    state: { recentActivities },
    dispatch,
  } = useRecentActivity();
  const [maxVisible, setMaxVisible] = useState(3);
  const navigate = useNavigate();

  useEffect(() => {
    const updateVisible = () => {
      const width = window.innerWidth;
      if (width >= 1024) setMaxVisible(6);
      else if (width >= 768) setMaxVisible(5);
      else setMaxVisible(4);
    };

    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  console.log(recentActivities);

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

    navigate(
      searchMethod === "stats"
        ? `/search/${searchCode}/stats`
        : `/search/${searchCode}`
    );
  };

  const visibleActivities = recentActivities.slice(0, maxVisible);
  if (visibleActivities.length === 0) return null;

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-center w-full overflow-x-auto space-x-3 text-sm">
        {visibleActivities.map((activity, index) => (
          <>
            <Button
              onClick={() => handleSelectCourse(activity.courseCode)}
              variant="ghost"
              size="sm"
              className="group"
            >
              <span className="text-foreground hover:text-foreground transition-colors">
                {activity.courseCode}
              </span>
              <ArrowUpRightIcon className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:-translate-y-[2px] group-hover:translate-x-1 transition-all duration-200" />
            </Button>
            {index < visibleActivities.length - 1 && (
              <span className="mx-2 text-foreground/20">|</span>
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default RecentCourseLinks;
