from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Employee, Task
from ..schemas import EmployeeCreate, EmployeeResponse

router = APIRouter(
    prefix="/api/employees",
    tags=["Employees"]
)


@router.get("/", response_model=list[EmployeeResponse])
def get_employees(db: Session = Depends(get_db)):

    return db.query(Employee).order_by(Employee.id).all()


@router.post(
    "/",
    response_model=EmployeeResponse,
    status_code=201
)
def create_employee(
    data: EmployeeCreate,
    db: Session = Depends(get_db)
):

    existing = db.query(Employee).filter(
        Employee.email == data.email
    ).first()

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Email already exists"
        )

    employee = Employee(**data.model_dump())

    db.add(employee)
    db.commit()
    db.refresh(employee)

    return employee


@router.delete("/{employee_id}")
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db)
):

    employee = db.query(Employee).filter(
        Employee.id == employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    assigned_task = db.query(Task).filter(
        Task.employee_id == employee_id
    ).first()

    if assigned_task:
        raise HTTPException(
            status_code=409,
            detail="Delete assigned tasks before deleting employee"
        )

    db.delete(employee)
    db.commit()

    return {"message": "Employee deleted successfully"}