import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Trash2,
  CheckCircle,
  ShieldAlert,
  RefreshCw,
  LayoutDashboard,
  CheckSquare,
  Clock,
  Zap,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface Task {
  id: string;
  title: string;
  status: "PENDING" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  createdAt: string;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<"LOW" | "MEDIUM" | "HIGH">(
    "MEDIUM",
  );
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
      console.error("Error fetching tasks", error);
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
      setNewTitle("");
    } catch (error) {
      console.error("Error creating task", error);
    }
  };

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === "PENDING" ? "COMPLETED" : "PENDING";
    try {
      const response = await axios.patch(`${API_URL}/tasks/${task.id}`, {
        status: newStatus,
      });
      setTasks(tasks.map((t) => (t.id === task.id ? response.data : t)));
    } catch (error) {
      console.error("Error updating task status", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting task", error);
    }
  };

  const activateKaliumMode = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/tasks/activate-kalium`);
      setTasks(response.data);
      setKaliumMode(true);
    } catch (error) {
      console.error("Error activating Kalium mode", error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-500/20 text-red-400 border border-red-500/30 glow-primary">
            <Zap className="w-3 h-3" /> Alta
          </span>
        );
      case "MEDIUM":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
            Media
          </span>
        );
      case "LOW":
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/20 text-blue-400 border border-blue-500/30">
            Baja
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-x-hidden">
      {/* Abstract Background Blobs */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full -z-10 animate-pulse-soft" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full -z-10" />

      {/* Header */}
      <header className="glass sticky top-0 z-50 py-4 mb-2 shadow-2xl shadow-black/50">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl shadow-lg glow-primary">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase leading-none italic">
                Kalium
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">
                Task System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={activateKaliumMode}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-black transition-all duration-500 overflow-hidden relative group uppercase tracking-tight ${
                kaliumMode
                  ? "bg-red-600 text-white shadow-[0_0_25px_rgba(220,38,38,0.5)] scale-105"
                  : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full bg-current ${kaliumMode ? "animate-ping" : ""}`}
              />
              {kaliumMode ? "Protocolo Kalium" : "Activar Kalium"}
              <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 -z-10" />
            </button>
            <button
              onClick={fetchTasks}
              className="p-2.5 glass-pill hover:bg-white/10 transition-all text-white/50 hover:text-white"
              title="Reset Database View"
            >
              <RefreshCw
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Form */}
        <div className="lg:col-span-4">
          <div className="glass rounded-3xl p-8 shadow-xl sticky top-28">
            <h2 className="text-xl font-black mb-6 flex items-center gap-3 italic uppercase tracking-tighter">
              <Plus className="w-6 h-6 text-primary not-italic" />
              Nueva Misión
            </h2>

            <form onSubmit={createTask} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                  Identificador de Tarea
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Pentesting Neural Link..."
                  className="w-full bg-white/5 border border-white/5 focus:border-primary/50 focus:bg-white/10 rounded-2xl px-5 py-4 outline-none transition-all text-sm font-medium placeholder:text-white/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
                  Nivel de Prioridad
                </label>
                <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
                  {(["LOW", "MEDIUM", "HIGH"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewPriority(p)}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all duration-300 ${
                        newPriority === p
                          ? "bg-primary text-white shadow-lg glow-primary"
                          : "text-white/40 hover:text-white/60"
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
                className="w-full bg-primary hover:bg-primary/80 text-white font-black py-4 rounded-2xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed mt-4 shadow-xl glow-primary uppercase tracking-tighter text-sm"
              >
                Registrar Tarea
              </button>
            </form>

            {/* <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary shrink-0" />
              <p className="text-[11px] leading-relaxed text-white/50 font-medium">
                Todas las tareas registradas bajo Modo Kalium son cifradas y
                priorizadas automáticamente por el núcleo del sistema.
              </p>
            </div> */}
          </div>
        </div>

        {/* Right Column: List */}
        <div className="lg:col-span-8">
          <div className="flex items-end justify-between mb-8 px-2">
            <div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                <LayoutDashboard className="w-8 h-8 text-primary not-italic" />
                {kaliumMode ? "Células Críticas" : "Consola de Tareas"}
              </h2>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1 ml-11">
                {kaliumMode
                  ? "Filtradas por Alta Prioridad"
                  : "Vista Global del Sistema"}
              </p>
            </div>

            <div className="flex items-center gap-3 glass-pill px-4 py-2 border-white/5 shadow-lg">
              <CheckSquare className="w-4 h-4 text-primary" />
              <span className="text-xs font-black tracking-tighter uppercase whitespace-nowrap">
                {tasks.filter((t) => t.status === "COMPLETED").length} /{" "}
                {tasks.length}{" "}
                <span className="text-white/30 ml-1">Completadas</span>
              </span>
            </div>
          </div>

          {loading && tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 glass rounded-3xl opacity-50">
              <RefreshCw className="w-12 h-12 animate-spin text-primary mb-6" />
              <p className="text-xs font-bold uppercase tracking-[0.2em]">
                Accediendo al Núcleo...
              </p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="glass rounded-[2rem] flex flex-col items-center justify-center py-32 text-center group">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <ShieldAlert className="w-10 h-10 text-white/10" />
              </div>
              <p className="text-xl font-black italic uppercase tracking-tight mb-2">
                Sin amenazas pendientes
              </p>
              <p className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">
                Sistema Operativo al 100%
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`group relative overflow-hidden transition-all duration-500 ${task.status === "COMPLETED" ? "opacity-40" : "hover:-translate-y-1"}`}
                >
                  <div
                    className={`glass rounded-2xl p-5 flex items-center gap-5 transition-all duration-500 group-hover:border-primary/40 group-hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] ${task.status === "COMPLETED" ? "bg-black/20 border-transparent" : ""}`}
                  >
                    {/* Checkbox Trigger */}
                    <button
                      onClick={() => toggleStatus(task)}
                      className={`relative w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-500 border-2 ${
                        task.status === "COMPLETED"
                          ? "bg-primary border-primary text-white scale-90"
                          : "bg-white/5 border-white/10 text-transparent hover:border-primary/50"
                      }`}
                    >
                      <CheckCircle
                        className={`w-5 h-5 ${task.status === "COMPLETED" ? "scale-100 rotate-0" : "scale-0 rotate-90"} transition-all duration-500`}
                      />
                      {!task.status && (
                        <div className="absolute inset-0 bg-primary/20 scale-0 group-hover:scale-100 rounded-lg transition-transform" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0 pr-10">
                      <h3
                        className={`text-lg font-black tracking-tight transition-all duration-500 truncate ${task.status === "COMPLETED" ? "text-white/30 line-through" : "text-white/90 group-hover:text-white"}`}
                      >
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-2">
                        {getPriorityBadge(task.priority)}
                        <div className="flex items-center gap-1.5 text-white/20 text-[10px] font-bold uppercase">
                          <Clock className="w-3 h-3" />
                          {new Date(task.createdAt).toLocaleDateString(
                            undefined,
                            { day: "numeric", month: "short" },
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-3 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                        title="Eliminar Registro"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Left Accent Bar */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-500 ${
                        task.priority === "HIGH"
                          ? "bg-red-500 shadow-[2px_0_10px_rgba(239,68,68,0.5)]"
                          : task.priority === "MEDIUM"
                            ? "bg-amber-500"
                            : "bg-blue-500"
                      } ${task.status === "COMPLETED" ? "opacity-0" : "opacity-100"}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="mt-20 py-12 border-t border-white/5 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10 blur-3xl opacity-20 translate-y-20" />
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer">
              <ShieldAlert className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Producido por Kalium
              </span>
            </div>
            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
              &copy; 2026 Kalium - Todos los derechos reservados
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
