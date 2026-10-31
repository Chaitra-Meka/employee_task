import type {
  DashboardSummary,
  Employee,
  NewEmployee,
  NewTask,
  Task,
  TaskStatus
} from "../types";

const API_URL =
  (import.meta as ImportMeta & {
    readonly env: { readonly VITE_API_URL: string };
  }).env.VITE_API_URL;

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {

  const response = await fetch(`${API_URL}${path}`, {
    ...options,

    headers: {
      ...(options.body
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers
    }
  });

  if (!response.ok) {

    const body = await response.json().catch(() => null);

    const detail = body?.detail;

    const message = Array.isArray(detail)
      ? detail.map((item: { msg?: string }) =>
          item.msg ?? "Invalid value"
        ).join(", ")
      : detail;

    throw new Error(
      message || `Request failed: ${response.status}`
    );
  }

  return response.json() as Promise<T>;
}

export const employeeApi = {

  getAll: () =>
    request<Employee[]>("/employees/"),

  create: (data: NewEmployee) =>
    request<Employee>("/employees/", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  delete: (id: number) =>
    request(`/employees/${id}`, {
      method: "DELETE"
    })
};

export const taskApi = {

  getAll: () =>
    request<Task[]>("/tasks/"),

  create: (data: NewTask) =>
    request<Task>("/tasks/", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  updateStatus: (
    id: number,
    status: TaskStatus
  ) =>
    request<Task>(`/tasks/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    }),

  delete: (id: number) =>
    request(`/tasks/${id}`, {
      method: "DELETE"
    })
};

export const dashboardApi = {

  getSummary: () =>
    request<DashboardSummary>("/dashboard/summary")
};