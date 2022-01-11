import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, switchMap, take } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { Todo, TodoStatus } from '../intefaces/todo';
import { TodoQuery } from '../state/query';
import { TodoStore } from '../state/store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  loading = false;
  todos: Todo[] = [];

  constructor(private router: Router, private todoQuery: TodoQuery, private todoStore: TodoStore, public apiService: ApiService ) { }

  ngOnInit(): void {
    this.todoQuery.getLoading().subscribe( res => this.loading = res );
    this.todoQuery.getTodos().subscribe(res => this.todos = res);
    this.todoQuery.getLoaded().pipe(
      take(1),
      filter(res => !res),
      switchMap(() => {
        this.todoStore.setLoading(true);
        return this.apiService.getTodos()
      })
    ).subscribe(res => {
      this.todoStore.update(state => {
        return {
          todos: res
        }
      });
      this.todoStore.setLoading(false);
    }, err => {
      console.log(err);
      this.todoStore.setLoading(false)
    });
    
  }

  goToAddTodo() {
    this.router.navigate(['/add-todo'])
  }

  markAsCompleted(id: string) {
    console.log(id)
    this.todoStore.setLoading(true);
    this.apiService.updateTodo(id, {status: TodoStatus.DONE})
    .subscribe(
      (res) => {
        this.todoStore.update(state => {
          const todos = [...state.todos]
          const index = todos.findIndex(i => i._id === id)
          todos[index] = {
            ...todos[index],
            status: TodoStatus.DONE
          }
          return {
            ...state,
            todos
          }
        })
        this.todoStore.setLoading(false);
      }, err => console.log(err)
    )
  }

  deleteTodo(id: string) {
    this.apiService.deletTodo(id)
    .subscribe(
      (res) => {
        this.todoStore.update(state => {
          return {
            ...state,
            todos: state.todos.filter(todo => todo._id !== id)
          }
        })
      }, err => console.log(err)
    )
    
  }


}
