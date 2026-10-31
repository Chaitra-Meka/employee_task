from datetime import date
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


Priority = Literal["Low", "Medium", "High"]

TaskStatus = Literal[
    "Pending",
    "In Progress",
    "Completed"
]


class EmployeeCreate(BaseModel):

    name: str = Field(min_length=2, max_length=100)

    email: EmailStr

    department: str = Field(min_length=2, max_length=100)


class EmployeeResponse(EmployeeCreate):

    id: int

    model_config = ConfigDict(from_attributes=True)


class TaskCreate(BaseModel):

    title: str = Field(min_length=2, max_length=150)

    description: str = ""

    priority: Priority

    due_date: date

    employee_id: int


class TaskStatusUpdate(BaseModel):

    status: TaskStatus


class TaskResponse(BaseModel):

    id: int

    title: str

    description: str

    priority: Priority

    due_date: date

    status: TaskStatus

    employee_id: int

    employee_name: str