import { useMemo, useState } from "react";

import Header from "../components/Header";
import TaskForm from "../components/TaskForm";
import TaskTable from "../components/TaskTable";

import type {
  Employee,
  NewTask,
  Task,
  TaskStatus
} from "../types";

interface Props {
  employees: Employee[];
  tasks: Task[];
  onAdd: (data: NewTask) => Promise<void>;
  onStatusChange: (
    id: number,
    status: TaskStatus
  ) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function Tasks({
  employees,
  tasks,
  onAdd,
  onStatusChange,
  onDelete
}: Props) {

  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [error, setError] = useState("");

  const filteredTasks = useMemo(() => {

    if (statusFilter === "All") {
      return tasks;
    }

    return tasks.filter(
      (task) => task.status === statusFilter
    );

  }, [tasks, statusFilter]);

  async function updateStatus(
    id: number,
    status: TaskStatus
  ) {

    try {

      setError("");
      await onStatusChange(id, status);

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update status"
      );

    }
  }

  async function removeTask(id: number) {

    try {

      setError("");
      await onDelete(id);

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete task"
      );

    }
  }

  return (
    <section>

      <Header
        title="Task Management"
        subtitle="Create, assign and track employee tasks"
      />

      <div className="section-toolbar">

        <div>
          <h2>All Tasks</h2>
          <p>{tasks.length} tasks registered</p>
        </div>

        <button
          type="button"
          disabled={!employees.length}
          onClick={() =>
            setShowForm((current) => !current)
          }
        >
          {showForm ? "Close Form" : "+ Create Task"}
        </button>

      </div>

      {!employees.length && (
        <p className="info" role="status">
          Add an employee before creating tasks.
        </p>
      )}

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {showForm && (
        <TaskForm
          employees={employees}
          onSave={onAdd}
          onClose={() => setShowForm(false)}
        />
      )}

      <TaskTable
        tasks={filteredTasks}
        statusFilter={statusFilter}
        onFilter={setStatusFilter}
        onStatusChange={updateStatus}
        onDelete={removeTask}
      />

    </section>
  );
}