import {
  useCallback,
  useEffect,
  useState
} from "react";

import Sidebar, {
  type PageName
} from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Tasks from "./pages/Tasks";

import {
  dashboardApi,
  employeeApi,
  taskApi
} from "./services/api";

import type {
  DashboardSummary,
  Employee,
  NewEmployee,
  NewTask,
  Task,
  TaskStatus
} from "./types";

const emptySummary: DashboardSummary = {
  total_employees: 0,
  total_tasks: 0,
  completed_tasks: 0,
  pending_tasks: 0
};

export default function App() {

  const [page, setPage] =
    useState<PageName>("Dashboard");

  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [summary, setSummary] =
    useState<DashboardSummary>(emptySummary);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const loadData = useCallback(async () => {

    try {

      setError("");

      const [
        employeeData,
        taskData,
        summaryData
      ] = await Promise.all([

        employeeApi.getAll(),

        taskApi.getAll(),

        dashboardApi.getSummary()

      ]);

      setEmployees(employeeData);

      setTasks(taskData);

      setSummary(summaryData);

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load application data"
      );

    } finally {

      setLoading(false);

    }

  }, []);

  useEffect(() => {

    void loadData();

  }, [loadData]);

  async function addEmployee(data: NewEmployee) {

    await employeeApi.create(data);

    await loadData();
  }

  async function deleteEmployee(id: number) {

    await employeeApi.delete(id);

    await loadData();
  }

  async function addTask(data: NewTask) {

    await taskApi.create(data);

    await loadData();
  }

  async function updateTaskStatus(
    id: number,
    status: TaskStatus
  ) {

    await taskApi.updateStatus(id, status);

    await loadData();
  }

  async function deleteTask(id: number) {

    await taskApi.delete(id);

    await loadData();
  }

  if (loading) {

    return (
      <div className="center-state" role="status">
        Loading Employee Task Tracker...
      </div>
    );
  }

  return (
    <div className="app-layout">

      <Sidebar
        page={page}
        onNavigate={setPage}
      />

      <main className="main-content">

        {error && (

          <div className="error-banner" role="alert">

            <span>{error}</span>

            <button
              type="button"
              onClick={() => void loadData()}
            >
              Retry
            </button>

          </div>

        )}

        {page === "Dashboard" && (
          <Dashboard 
          summary={summary}
  tasks={tasks}
  onStatusChange={updateTaskStatus}
  onDelete={deleteTask} />
        )}

        {page === "Employees" && (

          <Employees
            employees={employees}
            onAdd={addEmployee}
            onDelete={deleteEmployee}
          />

        )}

        {page === "Tasks" && (

          <Tasks
            employees={employees}
            tasks={tasks}
            onAdd={addTask}
            onStatusChange={updateTaskStatus}
            onDelete={deleteTask}
          />

        )}

      </main>

    </div>
  );
}