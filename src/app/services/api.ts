import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private readonly baseUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // -----------------------
  // OSZTÁLYOK (READ)
  // -----------------------
  getOsztalyok(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/school_class`);
  }
  // -----------------------
  // DIÁKOK (CRUD)
  // -----------------------
  getDiakok(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/student`);
  }

  getDiakById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/student/${id}`);
  }

  createDiak(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/student`, payload);
  }
  updateDiak(id: number, payload: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/student/${id}`, payload);
  }
  deleteDiak(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/student/${id}`);
  }
}
