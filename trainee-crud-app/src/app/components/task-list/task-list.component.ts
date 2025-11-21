import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  taskService = inject(TaskService);
  updatingIds = new Set<number>();

  readonly priorities = {
    high: { label: 'Alta', class: 'bg-primary' },
    medium: { label: 'Média', class: 'bg-info' },
    low: { label: 'Baixa', class: 'bg-secondary' }
  } as const;

  readonly filterLabels = {
    all: 'Todas',
    pending: 'Pendentes', 
    completed: 'Concluídas'
  } as const;

  ngOnInit() {
    this.taskService.loadTasks();
  }

  onFilterChange(filter: 'all' | 'pending' | 'completed') {
    this.taskService.setFilter(filter);
  }

  get currentFilterLabel() {
    return this.filterLabels[this.taskService.filter()];
  }

  async toggleCompleted(task: Task) {
    this.updatingIds.add(task.id);
    
    try {
      await this.taskService.updateTask(task.id, { 
        completed: !task.completed 
      });
    } catch (error) {
      console.error('Erro ao atualizar tarefa');
    } finally {
      this.updatingIds.delete(task.id);
    }
  }

  isUpdating(id: number): boolean {
    return this.updatingIds.has(id);
  }

  trackById(index: number, item: Task): number {
    return item.id;
  }

  async deleteTask(task: Task) {
    if (confirm(`Excluir "${task.title}"?`)) {
      try {
        await this.taskService.deleteTask(task.id);
      } catch (error) {
        console.error('Erro ao excluir tarefa');
      }
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  getPriority(priority: keyof typeof this.priorities) {
    return this.priorities[priority] || { label: priority, class: 'bg-light' };
  }
}
