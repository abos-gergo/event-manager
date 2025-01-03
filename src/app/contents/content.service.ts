import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Content } from './contents.component';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  contentsRoute = 'http://localhost:3000/events';
  constructor(private http: HttpClient) {}

  async get(id: string = ''): Promise<Content[] | HttpErrorResponse> {
    const request = this.http.get<Content[]>(this.contentsRoute + id);

    try {
      const response = await lastValueFrom(request);
      return response;
    } catch (error) {
      console.error(error);
      return error as HttpErrorResponse;
    }
  }

  async create(content: Content): Promise<Content | HttpErrorResponse> {
    const body = content;

    const request = this.http.post<Content>(this.contentsRoute, body);

    try {
      const response = await lastValueFrom(request);
      return response;
    } catch (error) {
      console.error(error);
      return error as HttpErrorResponse;
    }
  }

  async edit(content: Content): Promise<Content | HttpErrorResponse> {
    const body = content;

    const request = this.http.patch<Content>(
      this.contentsRoute + `/${(content as any).id}`,
      body
    );

    try {
      const response = await lastValueFrom(request);
      return response;
    } catch (error) {
      console.error(error);
      return error as HttpErrorResponse;
    }
  }

  async delete(content: Content): Promise<Content | HttpErrorResponse> {
    const request = this.http.delete<Content>(
      this.contentsRoute + `/${(content as any).id}`
    );

    try {
      const response = await lastValueFrom(request);
      return response;
    } catch (error) {
      console.error(error);
      return error as HttpErrorResponse;
    }
  }
}
