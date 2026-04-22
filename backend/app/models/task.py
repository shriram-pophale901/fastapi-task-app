from typing import Optional
from sqlmodel import SQLModel, Field, Relationship

class TaskBase(SQLModel):
    title: str
    description: Optional[str] = None
    status: str = "pending"  # "pending", "in-progress", "completed"

class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    owner_id: int = Field(foreign_key="user.id")
    
    owner: Optional["User"] = Relationship(back_populates="tasks")

class TaskCreate(TaskBase):
    pass

class TaskRead(TaskBase):
    id: int
    owner_id: int

class TaskUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
