export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate: Date;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  updatedAt: Date;
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
