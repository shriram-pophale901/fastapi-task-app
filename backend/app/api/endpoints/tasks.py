from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.api import deps
from app.db import get_session
from app.models.task import Task, TaskCreate, TaskRead, TaskUpdate
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=TaskRead)
def create_task(task_in: TaskCreate, db: Session = Depends(get_session), current_user: User = Depends(deps.get_current_user)) -> Any:
    db_task = Task(**task_in.model_dump(), owner_id=current_user.id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.get("/", response_model=List[TaskRead])
def read_tasks(db: Session = Depends(get_session), current_user: User = Depends(deps.get_current_user), skip: int = 0, limit: int = 100) -> Any:
    if current_user.role == "admin":
        tasks = db.exec(select(Task).offset(skip).limit(limit)).all()
    else:
        tasks = db.exec(select(Task).where(Task.owner_id == current_user.id).offset(skip).limit(limit)).all()
    return tasks

@router.get("/{id}", response_model=TaskRead)
def read_task(id: int, db: Session = Depends(get_session), current_user: User = Depends(deps.get_current_user)) -> Any:
    task = db.get(Task, id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if current_user.role != "admin" and task.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    return task

@router.put("/{id}", response_model=TaskRead)
def update_task(id: int, task_in: TaskUpdate, db: Session = Depends(get_session), current_user: User = Depends(deps.get_current_user)) -> Any:
    task = db.get(Task, id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if current_user.role != "admin" and task.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    update_data = task_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)
    
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{id}")
def delete_task(id: int, db: Session = Depends(get_session), current_user: User = Depends(deps.get_current_user)) -> Any:
    task = db.get(Task, id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if current_user.role != "admin" and task.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db.delete(task)
    db.commit()
    return {"status": "success"}
