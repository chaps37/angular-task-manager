
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../services/task';
import { Task } from '../../models/task';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule, FormsModule],
  selector: 'app-task-list',
  styleUrl: './task-list.css',
  templateUrl: './task-list.html',
})
export class TaskList {
  private taskService = inject(TaskService);
  private cdr = inject(ChangeDetectorRef);

  tasks: Task[] = [];
  showForm = false;
  editingTaskId: number | null = null;
  searchTerm = '';
  statusFilter = 'all';

  taskForm = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
    status: new FormControl('todo'),
    priority: new FormControl('medium'),
    dueDate: new FormControl(''),
    category: new FormControl('')
  });

  constructor() {
    this.loadTasks();
  }

  loadTasks() {
  this.taskService.getTasks().subscribe({
    next: (tasks) => {
      this.tasks = [...tasks];
      this.cdr.markForCheck();
    },
    error: (err) => {
      console.error('Failed to load tasks:', err);
    }
  });
}

  get filteredTasks() {
    return this.tasks.filter(task => {
      const search = this.searchTerm.toLowerCase();

      const matchesSearch =
        (task.title ?? '').toLowerCase().includes(search) ||
        (task.description ?? '').toLowerCase().includes(search) ||
        (task.category ?? '').toLowerCase().includes(search);

      const matchesStatus =
        this.statusFilter === 'all' ||
        task.status === this.statusFilter;

      return matchesSearch && matchesStatus;
    });
  }

  addTask() {
    this.editingTaskId = null;
    this.taskForm.reset({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
      category: ''
    });
    this.showForm = !this.showForm;
  }

  editTask(task: Task) {
    this.editingTaskId = task.id;
    this.showForm = true;

    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ?? '',
      category: task.category
    });
  }

  submitTask() {
    const task: Task = {
      id: this.editingTaskId ?? 0,
      title: this.taskForm.value.title ?? '',
      description: this.taskForm.value.description ?? '',
      status: this.taskForm.value.status as Task['status'],
      priority: this.taskForm.value.priority as Task['priority'],
      dueDate: this.taskForm.value.dueDate ?? '',
      category: this.taskForm.value.category ?? ''
    };

    const request = this.editingTaskId !== null
      ? this.taskService.updateTask(task)
      : this.taskService.addTask(task);

    request.subscribe({
      next: () => {
        this.loadTasks();

        this.taskForm.reset({
          title: '',
          description: '',
          status: 'todo',
          priority: 'medium',
          dueDate: '',
          category: ''
        });

        this.editingTaskId = null;
        this.showForm = false;
      },
      error: (err) => {
        console.error('Failed to save task:', err);
      }
    });
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (err) => {
        console.error('Failed to delete task:', err);
      }
    });
  }
}