export type Priority = "Low" | "Medium" | "High";

export type TaskStatus =
  | "Pending"
  | "In Progress"
  | "Completed";

export interface Employee {
  id: number;
  name: string;
  email: string;
  department: string;
}

export type NewEmployee = Omit<Employee, "id">;

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  due_date: string;
  status: TaskStatus;
  employee_id: number;
  employee_name: string;
}

export type NewTask = Omit<
  Task,
  "id" | "status" | "employee_name"
>;

export interface DashboardSummary {
  total_employees: number;
  total_tasks: number;
  completed_tasks: number;
  pending_tasks: number;
}