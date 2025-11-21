import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './task-list.component.html'
})
export class TaskListComponent implements OnInit {
  taskService = inject(TaskService);
  updatingIds = new Set<number>();

  priorities = {
    high: { label: 'Alta', class: 'bg-primary' },
    medium: { label: 'Média', class: 'bg-info' },
    low: { label: 'Baixa', class: 'bg-secondary' }
  };

  filterLabels = {
    all: 'Todas',
    pending: 'Pendentes', 
    completed: 'Concluídas'
  };

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
      await this.taskService.updateTask(task.id, { completed: !task.completed });
    } finally {
      this.updatingIds.delete(task.id);
    }
  }

  isUpdating(id: number) {
    return this.updatingIds.has(id);
  }

  async deleteTask(task: Task) {
    if (confirm(`Excluir "${task.title}"?`)) {
      await this.taskService.deleteTask(task.id);
    }
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  getPriority(priority: keyof typeof this.priorities) {
    return this.priorities[priority] || { label: priority, class: 'bg-light' };
  }
}
