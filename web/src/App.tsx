import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Trash2, 
  CheckCircle, 
  Circle, 
  ShieldAlert, 
  Filter, 
  RefreshCw,
  LayoutDashboard,
  CheckSquare
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Task {
  id: string;
  title: string;
  status: 'PENDING' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [kaliumMode, setKaliumMode] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data);
      setKaliumMode(false);
    } catch (error) {
      console.error('Error fetching tasks', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const response = await axios.post(`${API_URL}/tasks`, {
        title: newTitle,
        priority: newPriority,
      });
      setTasks([response.data, ...tasks]);
      setNewTitle('');
    } catch (error) {
      console.error('Error creating task', error);
    }
  };

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === 'PENDING' ? 'COMPLETED' : 'PENDING';
    try {
      const response = await axios.patch(`${API_URL}/tasks/${task.id}`, {
        status: newStatus,
      });
      setTasks(tasks.map(t => t.id === task.id ? response.data : t));
    } catch (error) {
      console.error('Error updating task status', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  const activateKaliumMode = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/tasks/activate-kalium`);
      setTasks(response.data);
      setKaliumMode(true);
    } catch (error) {
      console.error('Error activating Kalium mode', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'MEDIUM': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'LOW': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary/30">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Kalium<span className="text-primary">TaskSystem</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={activateKaliumMode}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                kaliumMode 
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20 scale-105' 
                : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground border'
              }`}
            >
              <ShieldAlert className={`w-4 h-4 ${kaliumMode ? 'animate-pulse' : ''}`} />
              {kaliumMode ? 'Modo Kalium Activo' : 'Activar Modo Kalium'}
            </button>
            <button 
              onClick={fetchTasks}
              className="p-2 rounded-full hover:bg-secondary transition-colors"
              title="Recargar"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Create Task Form */}
          <div className="lg:col-span-4">
            <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Nueva Tarea
              </h2>
              <form onSubmit={createTask} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Título</label>
                  <input 
                    type="text" 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Escriba el título..."
                    className="w-full bg-secondary border-transparent focus:border-primary focus:ring-1 focus:ring-primary rounded-lg px-4 py-2.5 outline-none transition-all placeholder:text-muted-foreground/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Prioridad</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['LOW', 'MEDIUM', 'HIGH'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewPriority(p)}
                        className={`py-1.5 px-2 rounded-md text-xs font-semibold border transition-all ${
                          newPriority === p 
                          ? 'bg-primary border-primary text-primary-foreground' 
                          : 'bg-secondary border-transparent text-muted-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={!newTitle.trim()}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg shadow-primary/10"
                >
                  Añadir Tarea
                </button>
              </form>
            </div>
          </div>

          {/* Task List */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <LayoutDashboard className="w-6 h-6 text-primary" />
                {kaliumMode ? 'Tareas de Alta Prioridad' : 'Listado de Tareas'}
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-lg">
                <CheckSquare className="w-4 h-4" />
                <span>{tasks.filter(t => t.status === 'COMPLETED').length} de {tasks.length}</span>
              </div>
            </div>

            {loading && tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <RefreshCw className="w-10 h-10 animate-spin mb-4" />
                <p>Cargando tareas...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="bg-card border-2 border-dashed rounded-2xl flex flex-col items-center justify-center py-20 text-muted-foreground">
                <ShieldAlert className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-lg font-medium">No hay tareas pendientes</p>
                <p className="text-sm opacity-60">¡Buen trabajo!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div 
                    key={task.id}
                    className={`group bg-card border rounded-xl p-4 flex items-center gap-4 transition-all hover:border-primary/40 hover:shadow-md ${task.status === 'COMPLETED' ? 'opacity-70' : ''}`}
                  >
                    <button 
                      onClick={() => toggleStatus(task)}
                      className={`transition-colors ${task.status === 'COMPLETED' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                    >
                      {task.status === 'COMPLETED' ? (
                        <CheckCircle className="w-6 h-6 fill-primary/10" />
                      ) : (
                        <Circle className="w-6 h-6 opacity-40 hover:opacity-100" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium truncate ${task.status === 'COMPLETED' ? 'line-through decoration-primary/50' : ''}`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                           {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      <footer className="border-t py-12 mt-12 bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2026 KaliumTaskSystem - Seguridad y Eficiencia
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
