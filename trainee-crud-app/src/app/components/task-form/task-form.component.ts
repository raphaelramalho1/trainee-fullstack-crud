import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './task-form.component.html'
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

  isFieldInvalid(fieldName: string) {
    const field = this.taskForm.get(fieldName);
    return field?.invalid && field?.touched;
  }

  getFieldError(fieldName: string) {
    const field = this.taskForm.get(fieldName);
    if (!field?.errors || !field?.touched) return '';

    if (field.errors['required']) {
      const messages: any = {
        title: 'Título é obrigatório',
        dueDate: 'Data é obrigatória',
        priority: 'Prioridade é obrigatória'
      };
      return messages[fieldName] || 'Campo obrigatório';
    }
    
    if (field.errors['minlength']) {
      return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    }
    
    return 'Campo inválido';
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
          this.taskForm.patchValue(task);
        } else {
          this.goBack();
        }
      } catch {
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
        const taskData = this.taskForm.value;
        
        if (this.isEditMode() && this.taskId()) {
          await this.taskService.updateTask(this.taskId()!, taskData);
        } else {
          await this.taskService.createTask(taskData);
        }
        
        this.goBack();
      } finally {
        this.saving.set(false);
      }
    } else {
      this.taskForm.markAllAsTouched();
    }
  }

  goBack() {
    this.router.navigate(['/tarefas']);
  }
}
