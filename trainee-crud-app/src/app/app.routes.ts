import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/tarefas', pathMatch: 'full' },
  { 
    path: 'tarefas', 
    loadComponent: () => import('./components/task-list/task-list.component').then(m => m.TaskListComponent)
  },
  { 
    path: 'tarefas/nova', 
    loadComponent: () => import('./components/task-form/task-form.component').then(m => m.TaskFormComponent)
  },
  { 
    path: 'tarefas/editar/:id', 
    loadComponent: () => import('./components/task-form/task-form.component').then(m => m.TaskFormComponent)
  },
  { path: '**', redirectTo: '/tarefas' }
];
