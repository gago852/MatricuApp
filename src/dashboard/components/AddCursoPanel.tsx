import { Button } from "@/components/ui/button";
import { AddCursoCard } from "./AddCursoCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { Curso } from "@/types/types";

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

export const AddCursoPanel = () => {
  const [searchValue, setSearchValue] = useState("");
  const [semesterFilter, setSemesterFilter] = useState<number | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [availableCredits, setAvailableCredits] = useState(20);
  const [selectedCredits, setSelectedCredits] = useState(0);
  const [filteredCourses, setFilteredCourses] = useState<Curso[]>([]);

  const handleToggleCourse = (id: number) => {
    console.log({ id });
  };

  const handleOnClosePanel = () => {
    console.log("Close panel");
  };

  const handleAddCourses = () => {
    console.log("Add courses");
  };

  return (
    <div className="w-96 border-l border-border bg-card flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-foreground">Add Courses</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOnClosePanel}
            className="h-8 w-8 p-0"
          >
            ✕
          </Button>
        </div>

        <div className="text-sm space-y-1">
          <p className="text-muted-foreground">
            Available credits:{" "}
            <span className="font-semibold text-foreground">
              {availableCredits}
            </span>
          </p>
          <p className="text-muted-foreground">
            Selected:{" "}
            <span className="font-semibold text-accent">{selectedCredits}</span>{" "}
            credits
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 py-3 space-y-2 border-b border-border">
        <Input
          placeholder="Search courses..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="text-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              Semester {semesterFilter}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {SEMESTERS.map((sem) => (
              <DropdownMenuItem
                key={sem}
                onClick={() => setSemesterFilter(sem)}
              >
                Semester {sem}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Courses list */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-sm text-muted-foreground">
              No courses available
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredCourses.map((course) => (
              <AddCursoCard
                key={course.id}
                curso={course}
                selected={selectedCourses.includes(course.id)}
                onToggle={() => handleToggleCourse(course.id)}
                disabled={
                  selectedCredits + course.creditos > availableCredits &&
                  !selectedCourses.includes(course.id)
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border space-y-2">
        <Button
          onClick={handleAddCourses}
          disabled={selectedCourses.length === 0}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
        >
          Add {selectedCourses.length > 0 ? `(${selectedCourses.length})` : ""}
        </Button>
        <Button
          variant="outline"
          onClick={handleOnClosePanel}
          className="w-full"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
