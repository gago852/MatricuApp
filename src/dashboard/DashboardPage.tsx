import { Header } from "@/components/shared/Header";
import { CursoPanel } from "./components/CursoPanel";
import { useState } from "react";
import { AddCursoPanel } from "./components/AddCursoPanel";

export const DashboardPage = () => {
  const [showAddCourses, setShowAddCourses] = useState(false);
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header student={usuarioMock} />

      <main className="flex-1 flex overflow-hidden">
        <div className={`flex-1 flex flex-col overflow-hidden transition-all`}>
          <CursoPanel />
        </div>

        {showAddCourses && <AddCursoPanel />}
      </main>
    </div>
  );
};
