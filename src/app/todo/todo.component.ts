import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { TodoStore } from '../state/store';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.sass']
})
export class TodoComponent implements OnInit {

  form: FormGroup;

  constructor(public fb: FormBuilder, private apiService: ApiService, private todoStore: TodoStore, private router: Router) { 
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    
  }

  addTodo() {
    console.log(this.form.value);
    this.todoStore.setLoading(true);
    this.apiService.addTodo(this.form.controls['title'].value, this.form.controls['description'].value)
    .subscribe(
      (res) => {
        this.todoStore.update(state => {
          return {
            todos: [
              ...state.todos,
              res
            ]
          }
        })
        this.todoStore.setLoading(false)
        this.router.navigate(['/'])
      }
    )
  }

  
}
