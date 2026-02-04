'use client';

import { useSession } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useOptimistic, startTransition } from 'react';
import apiClient from '@/services/api-client';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

// API client for backend connection - these functions will be called within component functions
const taskApi = {
  getTasks: async (userId: string, token: string): Promise<Task[]> => {
    return apiClient.get<Task[]>(`/api/${userId}/tasks`, token);
  },
  createTask: async (userId: string, taskData: Omit<Task, 'id'>, token: string): Promise<Task> => {
    return apiClient.post<Task>(`/api/${userId}/tasks`, taskData, token);
  },
  updateTask: async (userId: string, id: string, taskData: Partial<Task>, token: string): Promise<Task> => {
    return apiClient.put<Task>(`/api/${userId}/tasks/${id}`, taskData, token);
  },
  deleteTask: async (userId: string, id: string, token: string): Promise<{ success: boolean }> => {
    try {
      await apiClient.delete(`/api/${userId}/tasks/${id}`, token);
      return { success: true };
    } catch (error) {
      console.error('Error deleting task:', error);
      return { success: false };
    }
  }
};

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  interface OptimisticTask {
    type: 'add' | 'update' | 'delete';
    data: Task;
  }

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [optimisticTasks, addOptimisticTask] = useOptimistic(
    tasks,
    (state, newTask: OptimisticTask) => {
      if (newTask.type === 'add') {
        return [{ ...newTask.data, id: 'optimistic-' + Date.now() }, ...state];
      }
      if (newTask.type === 'update') {
        return state.map(t =>
          t.id === newTask.data.id ? { ...t, ...newTask.data } : t
        );
      }
      if (newTask.type === 'delete') {
        return state.filter(t => t.id !== newTask.data.id);
      }
      return state;
    }
  );

  useEffect(() => {
    // Only redirect to login if session is explicitly null AND loading is complete
    // This prevents premature redirects when session is still being loaded
    if (!isPending && session === null) {
      router.push('/login');
    } else if (session) {
      // Load tasks
      const loadTasks = async () => {
        setIsLoadingTasks(true);
        const userId = session?.user?.id;
        const token = session?.session?.token;
        try {
          if (userId && token) {
            const loadedTasks = await taskApi.getTasks(userId, token);
            setTasks(loadedTasks as Task[]);
          }
        } catch (error) {
          console.error('Error loading tasks:', error);
        } finally {
          setIsLoadingTasks(false);
        }
      };
      loadTasks();
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>

          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-10 bg-gray-200 rounded w-1/4 mt-4"></div>
            </div>
          </div>

          <div className="h-6 bg-gray-200 rounded w-1/5 mb-4"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Redirect is handled by useEffect
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTaskTitle.trim()) return;

    // Prepare the new task
    const newTask: Omit<Task, 'id'> = {
      title: newTaskTitle,
      description: newTaskDescription,
      completed: false,
    };

    // Optimistically add the task with a temporary ID
    const tempId = 'optimistic-' + Date.now();

    // Wrap the optimistic update in a transition to avoid the error
    startTransition(() => {
      addOptimisticTask({ type: 'add', data: { ...newTask, id: tempId } });
    });

    // Actually create the task
    const userId = session?.user?.id;
    const token = session?.session?.token;
    if (userId && token) {
      try {
        const createdTask: Task = await taskApi.createTask(userId, newTask, token);
        setTasks(prev => [createdTask, ...prev.filter(t => !t.id.startsWith('optimistic-'))]);
      } catch (error) {
        console.error('Error creating task:', error);
        // Remove the optimistic task if creation failed
        setTasks(prev => prev.filter(t => !t.id.startsWith('optimistic-')));
      }
    } else {
      // Remove the optimistic task if no user/token
      setTasks(prev => prev.filter(t => !t.id.startsWith('optimistic-')));
    }

    // Reset form
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  const handleToggleTask = async (task: Task) => {
    const updatedTask = { ...task, completed: !task.completed };

    // Optimistically update the task
    addOptimisticTask({ type: 'update', data: updatedTask });

    // Actually update the task
    const userId = session?.user?.id;
    const token = session?.session?.token;
    if (userId && token) {
      await taskApi.updateTask(userId, task.id, updatedTask, token);
    }
    setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
  };

  const handleDeleteTask = async (taskId: string) => {
    // Optimistically delete the task
    addOptimisticTask({ type: 'delete', data: { id: taskId, title: '', completed: false } });

    // Actually delete the task
    const userId = session?.user?.id;
    const token = session?.session?.token;
    if (userId && token) {
      await taskApi.deleteTask(userId, taskId, token);
    }
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>

      <Card className="mb-8 ">
        <CardHeader >
          <CardTitle>Create New Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="Task description (optional)"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
            <Button type="submit">Add Task</Button>

            <Link href="/#testimonials">
              <Button variant="secondary">
                Your Feedback
              </Button>
            </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Your Tasks</h2>

        {isLoadingTasks && optimisticTasks.length === 0 ? (
          // Loading skeleton while tasks are being fetched
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, index) => (
              <Card key={`skeleton-${index}`} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <div className="h-8 w-16 bg-gray-200 rounded"></div>
                      <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : optimisticTasks.length === 0 ? (
          <p className="text-gray-500">No tasks yet. Create your first task!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {optimisticTasks.map((task) => (
              <Card key={task.id} className={task.completed ? 'opacity-75' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className={`font-semibold ${task.completed ? 'line-through' : ''}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-gray-600 mt-2">{task.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleTask(task)}
                      >
                        {task.completed ? 'Undo' : 'Done'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}