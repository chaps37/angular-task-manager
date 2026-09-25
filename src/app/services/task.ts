import { Service } from '@angular/core';
import { Task } from '../models/task';

@Service()
export class TaskService {
    private tasks: Task [] = [
        {
            id:1,
            title: 'Build portfolio website',
            description: 'Create my angular portfolio project',
            status: 'in-progress',
            priority:'high',
            dueDate: '2026-09-20',
            category:'Portfolio'
        },
        {
            id:2,
            title: 'Update Resume',
            description: 'Add my new Angular Project to my resume',
            status: 'todo',
            priority:'medium',
            dueDate: '2026-09-18',
            category:'Carrer'
        },
        {
            id:3,
            title: 'Learn Angular routing',
            description: 'Practice Angular Routing and navigation',
            status: 'completed',
            priority:'low',
            dueDate: '2026-09-15',
            category:'Learning'
        },
        
        

    ];
    getTasks(): Task[] {
        return this.tasks;
 
   }

   addTask(task: Task): void {
    this.tasks.push(task);
   }
}
