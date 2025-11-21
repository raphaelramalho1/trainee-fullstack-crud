export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  dueDate: string;
  completed?: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  dueDate?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
}
