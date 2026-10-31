import {
  useState,
  type ChangeEvent,
  type FormEvent
} from "react";

import type {
  Employee,
  NewTask,
  Priority
} from "../types";

interface Props {
  employees: Employee[];
  onSave: (data: NewTask) => Promise<void>;
  onClose: () => void;
}

export default function TaskForm({
  employees,
  onSave,
  onClose
}: Props) {

  const [form, setForm] = useState<NewTask>({
    title: "",
    description: "",
    priority: "Medium",
    due_date: "",
    employee_id: employees[0]?.id ?? 0
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) {

    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "employee_id"
          ? Number(value)
          : value
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault();

    setSaving(true);
    setError("");

    try {

      await onSave(form);
      onClose();

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to create task"
      );

    } finally {

      setSaving(false);

    }
  }

  return (
    <form
      className="form-card"
      onSubmit={handleSubmit}
    >

      <h3>Create Task</h3>

      <label htmlFor="task-title">Title</label>

      <input
        id="task-title"
        name="title"
        value={form.title}
        onChange={handleChange}
        minLength={2}
        required
      />

      <label htmlFor="task-description">
        Description
      </label>

      <textarea
        id="task-description"
        name="description"
        value={form.description}
        onChange={handleChange}
      />

      <label htmlFor="task-priority">Priority</label>

      <select
        id="task-priority"
        name="priority"
        value={form.priority}
        onChange={handleChange}
      >

        {(["Low", "Medium", "High"] as Priority[])
          .map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}

      </select>

      <label htmlFor="task-due-date">Due Date</label>

      <input
        id="task-due-date"
        type="date"
        name="due_date"
        value={form.due_date}
        onChange={handleChange}
        required
      />

      <label htmlFor="task-employee">
        Assign Employee
      </label>

      <select
        id="task-employee"
        name="employee_id"
        value={form.employee_id}
        onChange={handleChange}
        required
      >

        {employees.map((employee) => (

          <option
            key={employee.id}
            value={employee.id}
          >
            {employee.name}
          </option>

        ))}

      </select>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <div className="form-actions">

        <button
          type="button"
          className="button-muted"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving || employees.length === 0}
        >
          {saving ? "Creating..." : "Create Task"}
        </button>

      </div>

    </form>
  );
}