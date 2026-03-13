import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  token: string;
  usuario: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
  };
}

export interface RegisterResponse {
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';
  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.token);
        localStorage.setItem(this.userKey, JSON.stringify(response.usuario));
        this.authStatus.next(true);
      })
    );
  }

 // register(userData: { name: string; email: string; password: string; role: string }): Observable<RegisterResponse> {
    // El backend espera nombre, email, password y rol (admin/empleado)
   // const body = {
    //  nombre: userData.name,
    //  email: userData.email,
    //  password: userData.password,
    //  rol: userData.role // ya viene como 'admin' o 'empleado'
 //   };
 //   return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, body);
 // }
  register(userData: any): Observable<any> {
  const body = {
    nombre: userData.name,
    email: userData.email,
    password: userData.password,
    rol: userData.role
  };
  console.log('Enviando registro:', body);
  return this.http.post(`${this.apiUrl}/register`, body);
}

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.authStatus.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  getRole(): string | null {
    return this.getUser()?.rol || null;
  }
}

