import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http: HttpClient) { }

  get(id?: any): Observable<any> {
    if (id) {
      return this.http.get(`/users/${id}`)
    }
    else {
      return this.http.get('/users' + location.search)
    }
  }

  create(data?: any): Observable<any> {
    if (data) {
      return this.http.post('/users', data)
    }
    else {
      return this.http.get('/users/create')
    }
  }

  edit(id: any, data?: any): Observable<any> {
    if (data) {
      return this.http.put(`/users/${id}`, data)
    }
    else {
      return this.http.get(`/users/${id}`)
    }
  }

  delete(id: any, data?: any): Observable<any> {
    if (data) {
      return this.http.delete(`/users/${id}`)
    }
    else {
      return this.http.get(`/users/${id}`)
    }
  }
}