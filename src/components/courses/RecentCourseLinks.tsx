import { ArrowUpRightIcon } from "@primer/octicons-react";
import { Button } from "@/components/ui/button";
import useCourseHistory from "@/stores/CourseHistoryStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  searchMethod: string;
}

const RecentCourseLinks = ({ searchMethod }: Props) => {
  const { courses, addCourse, loadCourses } = useCourseHistory();
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const handleSelectCourse = (course: string) => {
    const searchCode = course.toUpperCase();
    if (!searchCode) return;

    addCourse(searchCode);

    navigate(
      searchMethod === "stats"
        ? `/search/${searchCode}/stats`
        : `/search/${searchCode}`
    );
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-center w-full overflow-x-auto space-x-3 text-sm">
        {courses.slice(0, 3).map((activity, index) => (
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
            {index < courses.slice(0, 3).length - 1 && (
              <span className="mx-2 text-foreground/20">|</span>
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default RecentCourseLinks;
