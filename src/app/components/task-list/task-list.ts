import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../services/task';
import { Task } from '../../models/task';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule,FormsModule],
  selector: 'app-task-list',
  styleUrl: './task-list.css',
  templateUrl: './task-list.html',
})
export class TaskList {
  private taskService = inject(TaskService);
  tasks = this.taskService.getTasks();
  showForm = false;
  editingTaskId: number | null = null;
  searchTerm: string = '';
  statusFilter: string = 'all';

  taskForm = new FormGroup ({
    title: new FormControl(''),
    description: new FormControl (''),
    status: new FormControl ('todo'),
    priority: new FormControl ('medium'),
    dueDate: new FormControl(''),
    category: new FormControl ('')
  });

  get filteredTasks() {
  return this.tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      task.category.toLowerCase().includes(this.searchTerm.toLowerCase());

    const matchesStatus =
      this.statusFilter === 'all' ||
      task.status === this.statusFilter;

    return matchesSearch && matchesStatus;
  });
}

  addTask() {
  this.showForm = !this.showForm;
  
}
editTask (task: Task) {
  this.editingTaskId = task.id;
  this.showForm = true;

  this.taskForm.patchValue ({
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    category: task.category
  });
}

submitTask() {
  const task: Task = {
    id: this.editingTaskId ?? Date.now(),
    title: this.taskForm.value.title ?? '',
    description: this.taskForm.value.description ?? '',
    status: this.taskForm.value.status as Task['status'],
    priority: this.taskForm.value.priority as Task['priority'],
    dueDate: this.taskForm.value.dueDate ?? '',
    category: this.taskForm.value.category ?? ''
  };

  if (this.editingTaskId !== null) {
    this.taskService.updateTask(task);
  } else {
    this.taskService.addTask(task);
  }

  this.taskForm.reset({
    status: 'todo',
    priority: 'medium'
  });

  this.editingTaskId = null;
  this.showForm = false;
}
deleteTask (id:number) {
  this.taskService.deleteTask(id);
  this.tasks = this.taskService.getTasks();
}


}
