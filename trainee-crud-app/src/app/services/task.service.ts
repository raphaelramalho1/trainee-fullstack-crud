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
  private errorSignal = signal<string | null>(null);
  private filterSignal = signal<'all' | 'pending' | 'completed'>('all');

  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
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
    this.errorSignal.set(null);
    
    try {
      const tasks = await firstValueFrom(this.http.get<Task[]>(this.API_URL));
      this.tasksSignal.set(tasks || []);
    } catch (error) {
      this.errorSignal.set('Erro ao carregar tarefas');
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async createTask(task: CreateTaskDto): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    try {
      const newTask = await firstValueFrom(this.http.post<Task>(this.API_URL, task));
      if (newTask) {
        this.tasksSignal.update(tasks => [newTask, ...tasks]);
      }
    } catch (error) {
      this.errorSignal.set('Erro ao criar tarefa');
      console.error('Erro ao criar tarefa:', error);
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async updateTask(id: number, task: UpdateTaskDto): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    try {
      const updatedTask = await firstValueFrom(this.http.patch<Task>(`${this.API_URL}/${id}`, task));
      this.tasksSignal.update(tasks => 
        tasks.map(t => t.id === id ? updatedTask : t)
      );
    } catch (error) {
      this.errorSignal.set('Erro ao atualizar tarefa');
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async deleteTask(id: number): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    try {
      await firstValueFrom(this.http.delete(`${this.API_URL}/${id}`));
      this.tasksSignal.update(tasks => tasks.filter(t => t.id !== id));
    } catch (error) {
      this.errorSignal.set('Erro ao deletar tarefa');
      console.error('Erro ao deletar tarefa:', error);
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async getTaskById(id: number): Promise<Task | null> {
    try {
      const task = await firstValueFrom(this.http.get<Task>(`${this.API_URL}/${id}`));
      return task || null;
    } catch (error) {
      console.error('Erro ao buscar tarefa:', error);
      return null;
    }
  }
}
