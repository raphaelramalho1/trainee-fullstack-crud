import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})

export class TaskFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private taskService = inject(TaskService);

  taskForm: FormGroup;
  loading = signal(false);
  saving = signal(false);
  isEditMode = signal(false);
  taskId = signal<number | null>(null);

  constructor() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      dueDate: ['', Validators.required],
      priority: ['medium', Validators.required],
      completed: [false]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.taskForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.taskForm.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';

    const errors = field.errors;
    
    if (errors['required']) {
      return this.getRequiredMessage(fieldName);
    }
    if (errors['minlength']) {
      return `${this.getFieldLabel(fieldName)} deve ter pelo menos ${errors['minlength'].requiredLength} caracteres`;
    }
    
    return 'Campo inválido';
  }

  private getRequiredMessage(fieldName: string): string {
    const labels: Record<string, string> = {
      title: 'Título é obrigatório',
      dueDate: 'Data de vencimento é obrigatória',
      priority: 'Prioridade é obrigatória'
    };
    return labels[fieldName] || 'Campo obrigatório';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      title: 'Título',
      dueDate: 'Data de vencimento', 
      priority: 'Prioridade'
    };
    return labels[fieldName] || fieldName;
  }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.taskId.set(+id);
      this.loading.set(true);
      
      try {
        const task = await this.taskService.getTaskById(+id);
        if (task) {
          this.taskForm.patchValue({
            title: task.title,
            description: task.description || '',
            dueDate: task.dueDate, 
            priority: task.priority,
            completed: task.completed
          });
        } else {
          this.goBack();
        }
      } catch (error) {
        this.goBack();
      } finally {
        this.loading.set(false);
      }
    }
  }

  async onSubmit() {
    if (this.taskForm.valid) {
      this.saving.set(true);
      
      try {
        const formValue = this.taskForm.value;
        const taskData = {
          title: formValue.title!,
          description: formValue.description || undefined,
          dueDate: formValue.dueDate!,
          priority: formValue.priority!,
          completed: formValue.completed || false
        };

        if (this.isEditMode() && this.taskId()) {
          await this.taskService.updateTask(this.taskId()!, taskData);
          console.log('Tarefa atualizada com sucesso!');
        } else {
          await this.taskService.createTask(taskData);
          console.log('Tarefa criada com sucesso!');
        }

        this.goBack();
      } catch (error) {
        console.error(this.isEditMode() ? 'Erro ao atualizar tarefa' : 'Erro ao criar tarefa');
      } finally {
        this.saving.set(false);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.taskForm.controls).forEach(key => {
      const control = this.taskForm.get(key);
      control?.markAsTouched();
    });
  }

  goBack() {
    this.router.navigate(['/tarefas']);
  }
}
