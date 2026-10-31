import type {
  Task,
  TaskStatus
} from "../types";

interface Props {
  tasks: Task[];
  statusFilter: string;
  onFilter: (value: string) => void;
  onStatusChange: (
    id: number,
    status: TaskStatus
  ) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function TaskTable({
  tasks,
  statusFilter,
  onFilter,
  onStatusChange,
  onDelete
}: Props) {

  return (
    <section className="panel">

      <div className="panel-toolbar">

        <h3>Task List</h3>

        <label
          className="search-label"
          htmlFor="task-status-filter"
        >
          Filter by Status

          <select
            id="task-status-filter"
            value={statusFilter}
            onChange={(event) =>
              onFilter(event.target.value)
            }
          >
            <option value="All">All Statuses</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

        </label>

      </div>

      {tasks.length === 0 ? (

        <p className="empty-state">
          No tasks found.
        </p>

      ) : (

        <div className="table-scroll">

          <table>

            <caption className="sr-only">
              Tasks and their assigned employees
            </caption>

            <thead>
              <tr>
                <th>Task</th>
                <th>Employee</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {tasks.map((task) => (

                <tr key={task.id}>

                  <td>
                    <strong>{task.title}</strong>
                    <small className="task-description">
                      {task.description}
                    </small>
                  </td>

                  <td>{task.employee_name}</td>

                  <td>
                    <span
                      className={`priority ${task.priority.toLowerCase()}`}
                    >
                      {task.priority}
                    </span>
                  </td>

                  <td>{task.due_date}</td>

                  <td>

                    <select
                      aria-label={`Status for ${task.title}`}
                      value={task.status}
                      onChange={(event) =>
                        void onStatusChange(
                          task.id,
                          event.target.value as TaskStatus
                        )
                      }
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>

                  </td>

                  <td>

                    <button
                      type="button"
                      className="button-danger"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete ${task.title}?`
                          )
                        ) {
                          void onDelete(task.id);
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