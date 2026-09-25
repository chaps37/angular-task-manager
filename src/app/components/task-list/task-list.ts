import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaskService } from '../../services/task';
import { Task } from '../../models/task';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-task-list',
  styleUrl: './task-list.css',
  templateUrl: './task-list.html',
})
export class TaskList {
  private taskService = inject(TaskService);
  tasks = this.taskService.getTasks();
  showForm = false;

  taskForm = new FormGroup ({
    title: new FormControl(''),
    description: new FormControl (''),
    status: new FormControl ('todo'),
    priority: new FormControl ('medium'),
    dueDate: new FormControl(''),
    category: new FormControl ('')
  });

  addTask() {
  this.showForm = !this.showForm;
  
}
submitTask(){
 const newTask: Task ={
  id: Date.now(),
  title: this.taskForm.value.title ?? '',
  description: this.taskForm.value.description ?? '',
  status: this.taskForm.value.status as Task['status'],
  priority: this.taskForm.value.priority as Task['priority'],
  dueDate: this.taskForm.value.dueDate ?? '',
  category: this.taskForm.value.category ?? ''
 };
 this.taskService.addTask(newTask);
 
 this.taskForm.reset({
  status: 'todo',
  priority:'medium'
 });
 this.showForm = false;
}


}
