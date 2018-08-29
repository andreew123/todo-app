import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class TaskService {
  private httpOptions: object;
  private apiPrefixUrl: string = 'http://127.0.0.1:8000/';

  constructor(private httpClient: HttpClient) {
    
  }

  storeTask(taskValues: Array<any>, id?: number) {
    this.setHeader();    

    if (id) {
      return this.httpClient.put<any>(`${this.apiPrefixUrl}api/tasks/${id}`, taskValues, this.httpOptions)
        .pipe(map(response => {
          console.log('response', response);
          return response;
        }))
    } else {
      return this.httpClient.post<any>(`${this.apiPrefixUrl}api/tasks`, taskValues, this.httpOptions)
        .pipe(map(response => {
          console.log('response', response);
          return response;
        }))
    }

  }

  getTask(id?: number) {
    this.setHeader();
    
    let url = `${this.apiPrefixUrl}api/tasks`;
    url = id ? url + `/${id}` : url;

    return this.httpClient.get<any>(url, this.httpOptions)
      .pipe(map(response => {
        return response;
      }),
      catchError((err, caught) => {
        console.log('err', err)
        return err;
      }))
  }

  searchTask(value: any) {
    this.setHeader();
    let data = {'search': value};

    return this.httpClient.post<any>(`${this.apiPrefixUrl}api/tasks/search`, data, this.httpOptions)
      .pipe(map(response => {
        return response;
      }))
  }

  uploadFile(file: any, id: number) {
    this.setHeader(true);

    return this.httpClient.post<any>(`${this.apiPrefixUrl}api/tasks/upload/${id}`, file, this.httpOptions)
      .pipe(map(response => {
        console.log('response', response);
        return response;
      }))
  }

  setHeader(file: boolean = false) {
    const token = localStorage.getItem('token');

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      })
    };

    if (file)
      this.httpOptions = {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${token}`
        })
      };
  }

}
