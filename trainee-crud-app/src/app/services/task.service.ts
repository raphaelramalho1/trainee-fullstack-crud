import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Task, CreateTaskDto, UpdateTaskDto } from '../models/task.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/tasks`;

  private tasksSignal = signal<Task[]>([]);
  private loadingSignal = signal<boolean>(false);
  private filterSignal = signal<'all' | 'pending' | 'completed'>('all');

  readonly loading = this.loadingSignal.asReadonly();
  readonly filter = this.filterSignal.asReadonly();
  
  readonly filteredTasks = computed(() => {
    const tasks = this.tasksSignal();
    const filter = this.filterSignal();
    
    switch (filter) {
      case 'completed': return tasks.filter(t => t.completed);
      case 'pending': return tasks.filter(t => !t.completed);
      default: return tasks;
    }
  });

  get totalTasks() { return this.tasksSignal().length; }
  get completedTasks() { return this.tasksSignal().filter(t => t.completed); }
  get pendingTasks() { return this.tasksSignal().filter(t => !t.completed); }

  setFilter(filter: 'all' | 'pending' | 'completed') {
    this.filterSignal.set(filter);
  }

  async loadTasks(): Promise<void> {
    this.loadingSignal.set(true);
    try {
      const tasks = await firstValueFrom(this.http.get<Task[]>(this.API_URL));
      this.tasksSignal.set(tasks || []);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async createTask(task: CreateTaskDto): Promise<void> {
    const newTask = await firstValueFrom(this.http.post<Task>(this.API_URL, task));
    this.tasksSignal.update(tasks => [newTask, ...tasks]);
  }

  async updateTask(id: number, task: UpdateTaskDto): Promise<void> {
    const updatedTask = await firstValueFrom(this.http.patch<Task>(`${this.API_URL}/${id}`, task));
    this.tasksSignal.update(tasks => 
      tasks.map(t => t.id === id ? updatedTask : t)
    );
  }

  async deleteTask(id: number): Promise<void> {
    await firstValueFrom(this.http.delete(`${this.API_URL}/${id}`));
    this.tasksSignal.update(tasks => tasks.filter(t => t.id !== id));
  }

  async getTaskById(id: number): Promise<Task | null> {
    try {
      return await firstValueFrom(this.http.get<Task>(`${this.API_URL}/${id}`));
    } catch {
      return null;
    }
  }
}
