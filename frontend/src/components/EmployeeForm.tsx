import {
  useState,
  type ChangeEvent,
  type FormEvent
} from "react";

import type { NewEmployee } from "../types";

interface Props {
  onSave: (data: NewEmployee) => Promise<void>;
  onClose: () => void;
}

export default function EmployeeForm({
  onSave,
  onClose
}: Props) {

  const [form, setForm] = useState<NewEmployee>({
    name: "",
    email: "",
    department: ""
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    event: ChangeEvent<HTMLInputElement>
  ) {

    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
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
          : "Unable to save employee"
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

      <h3>Add Employee</h3>

      <label htmlFor="employee-name">Name</label>

      <input
        id="employee-name"
        name="name"
        value={form.name}
        onChange={handleChange}
        minLength={2}
        maxLength={100}
        required
      />

      <label htmlFor="employee-email">Email</label>

      <input
        id="employee-email"
        name="email"
        type="email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <label htmlFor="employee-department">
        Department
      </label>

      <input
        id="employee-department"
        name="department"
        value={form.department}
        onChange={handleChange}
        minLength={2}
        maxLength={100}
        required
      />

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

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Employee"}
        </button>

      </div>

    </form>
  );
}