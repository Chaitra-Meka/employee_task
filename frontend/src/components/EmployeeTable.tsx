import type { Employee } from "../types";

interface Props {
  employees: Employee[];
  search: string;
  onSearch: (value: string) => void;
  onDelete: (id: number) => void;
}

export default function EmployeeTable({
  employees,
  search,
  onSearch,
  onDelete
}: Props) {

  return (
    <section className="panel">

      <div className="panel-toolbar">

        <h3>Employee Directory</h3>

        <label
          className="search-label"
          htmlFor="employee-search"
        >
          Search Employees

          <input
            id="employee-search"
            value={search}
            onChange={(event) =>
              onSearch(event.target.value)
            }
            placeholder="Search by name..."
          />

        </label>

      </div>

      {employees.length === 0 ? (

        <p className="empty-state">
          No employees found.
        </p>

      ) : (

        <div className="table-scroll">

          <table>

            <caption className="sr-only">
              Employee directory
            </caption>

            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {employees.map((employee) => (

                <tr key={employee.id}>

                  <td>EMP-{employee.id}</td>

                  <td>{employee.name}</td>

                  <td>{employee.email}</td>

                  <td>{employee.department}</td>

                  <td>

                    <button
                      type="button"
                      className="button-danger"
                      aria-label={`Delete ${employee.name}`}
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete ${employee.name}?`
                          )
                        ) {
                          onDelete(employee.id);
                        }
                      }}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </section>
  );
}