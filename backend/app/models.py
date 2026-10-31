from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    ForeignKey,
    CheckConstraint
)

from sqlalchemy.orm import relationship

from .database import Base


class Employee(Base):

    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(
        String(150),
        unique=True,
        nullable=False
    )

    department = Column(String(100), nullable=False)

    tasks = relationship(
        "Task",
        back_populates="employee"
    )


class Task(Base):

    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(150), nullable=False)

    description = Column(String(500), default="")

    priority = Column(String(20), nullable=False)

    due_date = Column(Date, nullable=False)

    status = Column(
        String(30),
        default="Pending",
        nullable=False
    )

    employee_id = Column(
        Integer,
        ForeignKey("employees.id"),
        nullable=False
    )

    employee = relationship(
        "Employee",
        back_populates="tasks"
    )

    __table_args__ = (
        CheckConstraint(
            "priority IN ('Low', 'Medium', 'High')"
        ),
        CheckConstraint(
            "status IN ('Pending', 'In Progress', 'Completed')"
        ),
    )