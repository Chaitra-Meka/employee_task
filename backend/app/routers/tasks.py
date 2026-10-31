from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..models import Employee, Task
from ..schemas import (
    TaskCreate,
    TaskResponse,
    TaskStatusUpdate
)

router = APIRouter(
    prefix="/api/tasks",
    tags=["Tasks"]
)


def serialize_task(task):

    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "priority": task.priority,
        "due_date": task.due_date,
        "status": task.status,
        "employee_id": task.employee_id,
        "employee_name": task.employee.name
    }


@router.get("/", response_model=list[TaskResponse])
def get_tasks(db: Session = Depends(get_db)):

    tasks = db.query(Task).options(
        joinedload(Task.employee)
    ).order_by(Task.id.desc()).all()

    return [serialize_task(task) for task in tasks]


@router.post("/", response_model=TaskResponse, status_code=201)
def create_task(
    data: TaskCreate,
    db: Session = Depends(get_db)
):

    employee = db.query(Employee).filter(
        Employee.id == data.employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    task = Task(**data.model_dump())

    db.add(task)
    db.commit()
    db.refresh(task)

    return serialize_task(task)


@router.patch(
    "/{task_id}/status",
    response_model=TaskResponse
)
def update_task_status(
    task_id: int,
    data: TaskStatusUpdate,
    db: Session = Depends(get_db)
):

    task = db.query(Task).options(
        joinedload(Task.employee)
    ).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    task.status = data.status

    db.commit()
    db.refresh(task)

    return serialize_task(task)


@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):

    task = db.query(Task).filter(
        Task.id == task_id
    ).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    db.delete(task)
    db.commit()

    return {"message": "Task deleted successfully"}