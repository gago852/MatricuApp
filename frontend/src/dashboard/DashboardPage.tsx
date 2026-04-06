import { Header } from "@/components/shared/Header";
import { CursoPanel } from "./components/CursoPanel";
import { useEffect } from "react";
import { AddCursoPanel } from "./components/AddCursoPanel";
import { useDashboardStore } from "@/hook/useDashboardStore";
import { useAppSelector } from "@/hook/hooks";

export const DashboardPage = () => {
  const { loadDashBoard } = useDashboardStore();
  const { isOpen } = useAppSelector((state) => state.cursoPanel);

  useEffect(() => {
    loadDashBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex overflow-hidden">
        <div className={`flex-1 flex flex-col overflow-hidden transition-all`}>
          <CursoPanel />
        </div>

        {isOpen && <AddCursoPanel />}
      </main>
    </div>
  );
};
