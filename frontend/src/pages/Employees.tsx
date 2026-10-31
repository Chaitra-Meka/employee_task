import { useMemo, useState } from "react";

import Header from "../components/Header";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeTable from "../components/EmployeeTable";

import type {
  Employee,
  NewEmployee
} from "../types";

interface Props {
  employees: Employee[];
  onAdd: (data: NewEmployee) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function Employees({
  employees,
  onAdd,
  onDelete
}: Props) {

  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const filteredEmployees = useMemo(() => {

    return employees.filter((employee) =>
      employee.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [employees, search]);

  async function removeEmployee(id: number) {

    try {

      setError("");
      await onDelete(id);

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete employee"
      );

    }
  }

  return (
    <section>

      <Header
        title="Employees"
        subtitle="Manage your organization employees"
      />

      <div className="section-toolbar">

        <div>
          <h2>Employee Directory</h2>
          <p>{employees.length} employees registered</p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowForm((current) => !current)
          }
        >
          {showForm ? "Close Form" : "+ Add Employee"}
        </button>

      </div>

      {error && (
        <p className="error" role="alert">{error}</p>
      )}

      {showForm && (
        <EmployeeForm
          onSave={onAdd}
          onClose={() => setShowForm(false)}
        />
      )}

      <EmployeeTable
        employees={filteredEmployees}
        search={search}
        onSearch={setSearch}
        onDelete={(id) => void removeEmployee(id)}
      />

    </section>
  );
}