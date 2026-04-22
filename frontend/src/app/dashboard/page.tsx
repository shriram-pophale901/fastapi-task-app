"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { taskService } from "@/services/api";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await taskService.getTasks();
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else if (response.status === 401) {
        router.push("/login");
      } else {
        setError("Failed to fetch tasks");
      }
    } catch (err) {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await taskService.createTask({
        title: newTaskTitle,
        description: newTaskDesc,
      });
      if (response.ok) {
        setNewTaskTitle("");
        setNewTaskDesc("");
        setShowModal(false);
        fetchTasks();
      }
    } catch (err) {
      setError("Failed to create task");
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    try {
      const response = await taskService.deleteTask(id);
      if (response.ok) {
        fetchTasks();
      }
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="container" style={{ minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem' }}>My Tasks</h1>
          <p style={{ color: '#aaa' }}>Manage your daily activities and progress.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ New Task</button>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'white' }}>Logout</button>
        </div>
      </header>

      {error && <div style={{ color: 'var(--error)', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '2rem' }}>{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem', background: 'rgba(255,255,255,0.02)' }}>
          <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>No tasks found. Start by creating one!</p>
          <button className="btn-primary" onClick={() => setShowModal(true)}>Create First Task</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {tasks.map((task) => (
            <div key={task.id} className="card" style={{ transition: 'transform 0.2s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: '700', letterSpacing: '0.05em' }}>{task.status}</span>
                <button onClick={() => handleDeleteTask(task.id)} style={{ padding: '0.25rem', background: 'transparent', color: '#ff4d4d', fontSize: '0.8rem' }}>Delete</button>
              </div>
              <h3 style={{ marginBottom: '0.5rem' }}>{task.title}</h3>
              <p style={{ color: '#aaa', fontSize: '0.9rem' }}>{task.description || "No description provided."}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', background: '#111' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Title</label>
                <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} required placeholder="What needs to be done?" />
              </div>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Description (Optional)</label>
                <textarea 
                  value={newTaskDesc} 
                  onChange={(e) => setNewTaskDesc(e.target.value)} 
                  style={{ width: '100%', background: 'var(--glass)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.75rem', color: 'white', minHeight: '100px', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ background: 'transparent', color: 'white' }}>Cancel</button>
                <button type="submit" className="btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
