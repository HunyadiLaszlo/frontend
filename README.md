1️⃣ Backend (Laravel) – egyszerű API példa
Laravelben létrehozunk egy route-ot és egy controllert, ami JSON-t ad vissza:
// routes/api.php
Route::get('/users', [UserController::class, 'index']);
// app/Http/Controllers/UserController.php
namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::all());
    }
}
Ez a route JSON tömböt ad vissza az összes felhasználóról.

***********************************************
ANGULAR
***********************************************
ng new iskola

npm install bootstrap

//angular.json módosítása
"styles": [
"node_modules/bootstrap/dist/css/bootstrap.min.css",
"src/styles.css"
]

app.html felesleges elemeinek törlése, csak ez a sor maradjon benne

________________________________________
2️⃣ Angular – HttpClient modul importálása
***********************************************
No Standalone
***********************************************
Először győződj meg róla, hogy az Angular projektedben az HttpClientModule importálva van:
// app.module.ts
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    // más modulok...
    HttpClientModule
  ],
})
export class AppModule { }

***********************************************
Standalone
***********************************************
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient() // ⬅️ IGEN, IDE KELL TENNI!
  ]
};

// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app.config';

bootstrapApplication(AppComponent, appConfig);
________________________________________
3️⃣ Service létrehozása az API híváshoz
Angularban érdemes service-ben kezelni az API hívásokat:
// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8000/api/users'; // Laravel API URL

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
________________________________________
4️⃣ Komponensben az adatok lekérése

***********************************************
No Standalone
***********************************************
// users.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
  users: any[] = []; // ide töltjük az adatokat

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data; // itt töltjük a változóba
      },
      error: (err) => {
        console.error('Hiba az adatok lekérésekor:', err);
      }
    });
  }
}
***********************************************
Standalone
***********************************************
// users.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from './user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

  users: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => {
        console.error('Hiba az adatok lekérésekor:', err);
      }
    });
  }
}
________________________________________
5️⃣ Template-ben a megjelenítés
<!-- users.component.html -->
<ul>
  <li *ngFor="let user of users">
    {{ user.name }} - {{ user.email }}
  </li>
</ul>
