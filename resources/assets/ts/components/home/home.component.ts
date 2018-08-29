import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { first } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  private isLoggedIn: boolean;
  tasks: any;
  showFinished: FormControl;
  searchValue: FormControl;
  tasksForm: Array<any> = [];

  constructor(private formBuilder: FormBuilder,
              private http: Http,
              private authService: AuthService,
              private taskService: TaskService) {
    
    this.isLoggedIn = this.authService.isLoggedIn();
    
    let finished = localStorage.getItem('finished') ? localStorage.getItem('finished') : false;
    this.showFinished = new FormControl(finished);
    
    if (this.isLoggedIn) {
      this.getTasks();
    }
  }
  
  ngOnInit() {
    this.authService.authStatus.subscribe((status: boolean) => {
        this.isLoggedIn = status;
    });
  }

  changeShow() {
    if (this.showFinished) {
      localStorage.setItem('finished', 'true');
    } else {
      localStorage.removeItem('finished');
    }
    this.getTasks();
  }

  searchTask() {
    this.taskService.searchTask(this.searchValue).subscribe((tasks) => {
      this.fillTasksForm(tasks);
    })
  }

  getTasks() {
    console.log('na');
    this.taskService.getTask().subscribe((tasks) => {
      this.fillTasksForm(tasks);
    });
  }
  
  private fillTasksForm(tasks: any) {
    this.tasksForm = [];

    tasks.map((task: any) => {
      if (this.showFinished || (!this.showFinished && task.is_finished === 0)) {
        this.tasksForm.push(new FormGroup({
          'id': new FormControl(task.id),
          'title': new FormControl(task.title, [Validators.required]),
          'description': new FormControl(task.description),
          'days': new FormControl(this.getDaysBetweenTwoDate(task.created_at)),
          'edit': new FormControl(false),
          'is_finished': new FormControl(task.is_finished)
        }));
      }
    });
      
  }

  newTask() {
    this.tasksForm.unshift(new FormGroup({
      'id': new FormControl(null),
      'title': new FormControl(null, [Validators.required]),
      'description': new FormControl(null),
      'days': new FormControl(null),
      'edit': new FormControl(true),
      'is_finished': new FormControl(false)
    }));
  }

  onSelectFile(event: Event, index: number) {
    let elem = <HTMLInputElement> event.target;
    let file = elem.files[0];
    let formData = new FormData();

    formData.append('file', file, file.name);
    
    this.taskService.uploadFile(formData, this.tasksForm[index].value.id)
      .pipe(first())
      .subscribe(data => {
        console.log('data', data);
      },
        error => {
          console.log('error');
        });
  }

  private setTaskFinished(index:number) {
    this.tasksForm[index].value.is_finished = !this.tasksForm[index].value.is_finished;

    this.taskService.storeTask(this.tasksForm[index].value, this.tasksForm[index].value.id)
      .pipe(first())
      .subscribe(data => {
        this.getTasks();
      },
        error => {
          console.log('sikertelen mentés');
        });
  }

  private saveTask(event: Event, index: number) {
    event.preventDefault();
    console.log('event', this.tasksForm[index]);

    this.taskService.storeTask(this.tasksForm[index].value, this.tasksForm[index].value.id)
      .pipe(first())
      .subscribe(data => {
        this.tasksForm[index].controls.edit.value = false;
        this.getTasks();
      },
      error => {
        console.log('sikertelen mentés');
      });
  }

  private getDaysBetweenTwoDate(createdDate: any) {
    const fullDay = 1000 * 60 * 60 * 24;

    let difference = (new Date().getTime() - new Date(createdDate).getTime()) / fullDay;
    
    return Math.floor(difference);
  }

}
