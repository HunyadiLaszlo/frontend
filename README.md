                                ***********************************************
                                ANGULAR
                                ***********************************************
                                ng new iskola
				ng new iskola --style=css --routing=true

                                npm install bootstrap

                                //angular.json mĂłdosĂ­tĂˇsa
                                "styles": [
                                "node_modules/bootstrap/dist/css/bootstrap.min.css",
                                "src/styles.css"
                                ]

                                app.html felesleges elemeinek tĂ¶rlĂ©se, csak ez a sor maradjon benne

                                ________________________________________
                                2ď¸ŹâŁ Angular â€“ HttpClient modul importĂˇlĂˇsa
                                ***********************************************
                                No Standalone
                                ***********************************************
                                ElĹ‘szĂ¶r gyĹ‘zĹ‘dj meg rĂłla, hogy az Angular projektedben az HttpClientModule importĂˇlva van:
                                // app.module.ts
                                import { HttpClientModule } from '@angular/common/http';

                                @NgModule({
                                imports: [
                                    // mĂˇs modulok...
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
                                    provideHttpClient() // â¬…ď¸Ź IGEN, IDE KELL TENNI!
                                ]
                                };

                                // main.ts
                                import { bootstrapApplication } from '@angular/platform-browser';
                                import { AppComponent } from './app/app.component';
                                import { appConfig } from './app.config';

                                bootstrapApplication(AppComponent, appConfig);


                                ***********************************************
                                Service
                                ng g s services/api.ts
                                ***********************************************
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
                                // OSZTĂLYOK (READ)
                                // -----------------------
                                getOsztalyok(): Observable<any> {
                                    return this.http.get<any>(`${this.baseUrl}/school_class`);
                                }
                                // -----------------------
                                // DIĂKOK (CRUD)
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

                                ***********************************************
                                Models
                                ng generate interface models/diak ...
                                ***********************************************

                                export interface Diak {
                                id: number;
                                vezeteknev: string;
                                keresztnev: string;
                                email: string;
                                osztaly_id: number;
                                osztaly_nev: string;
                                szuletesi_datum: string | null;
                                }

                                export interface Osztaly {
                                id: number,
                                nev: string
                                }
                                
                                ***********************************************
                                Components
                                ng g c components/diak ...
                                ***********************************************
                                TS

                                import { CommonModule } from '@angular/common';
                                import { Component, OnInit } from '@angular/core';
                                import { FormsModule } from '@angular/forms';
                                import { Osztaly } from '../../models/osztaly';
                                import { Api } from '../../services/api';
                                import { RouterLink } from '@angular/router';

                                @Component({
                                selector: 'app-diak-letrehozas',
                                imports: [CommonModule, FormsModule, RouterLink],
                                templateUrl: './diak-letrehozas.html',
                                styleUrl: './diak-letrehozas.css',
                                })
                                export class DiakLetrehozas implements OnInit {
                                // OsztĂˇlyok a legĂ¶rdĂĽlĹ‘hĂ¶z
                                osztalyok: Osztaly[] = [];
                                // EgyszerĹ± "Ĺ±rlapmodell" (template-driven irĂˇny, FormsModule majd kĂ©sĹ‘bb)
                                form = {
                                    vezeteknev: '',
                                    keresztnev: '',
                                    email: '',
                                    osztaly_id: 0,
                                    szuletesi_datum: '', // ĂĽres string is ok (backend null-kĂ©nt kezeli, ha ĂĽresen kĂĽldjĂĽk vagy kihagyjuk)
                                };
                                constructor(private api: Api) {}
                                ngOnInit(): void {
                                    this.loadOsztalyok();
                                }
                                loadOsztalyok(): void {
                                    this.api.getOsztalyok().subscribe({
                                    next: (res) => {
                                        this.osztalyok = res.data;
                                    },
                                    error: () => {
                                        alert('Nem sikerĂĽlt betĂ¶lteni az osztĂˇlyokat.');
                                    },
                                    });
                                }
                                createDiak(): void {
                                    // MinimĂˇl validĂˇciĂł (HTML-ben is lesz required)
                                    if (
                                    !this.form.vezeteknev ||
                                    !this.form.keresztnev ||
                                    !this.form.email ||
                                    this.form.osztaly_id <= 0
                                    ) {
                                    alert('TĂ¶ltsd ki a kĂ¶telezĹ‘ mezĹ‘ket!');
                                    return;
                                    }
                                    // Payload Ă¶sszeĂˇllĂ­tĂˇs: ha a dĂˇtum ĂĽres, kĂĽldjĂĽk null-kĂ©nt
                                    const payload = {
                                    vezeteknev: this.form.vezeteknev.trim(),
                                    keresztnev: this.form.keresztnev.trim(),
                                    email: this.form.email.trim(),
                                    osztaly_id: Number(this.form.osztaly_id),
                                    szuletesi_datum: !this.form.szuletesi_datum ? null : this.form.szuletesi_datum.trim(),
                                    };
                                    this.api.createDiak(payload).subscribe({
                                    next: () => {
                                        alert('Sikeres mentĂ©s!');
                                        // Ĺ°rlap ĂĽrĂ­tĂ©se
                                        this.form = {
                                        vezeteknev: '',
                                        keresztnev: '',
                                        email: '',
                                        osztaly_id: 0,
                                        szuletesi_datum: '',
                                        };
                                    },
                                    error: () => {
                                        alert('Hiba tĂ¶rtĂ©nt a mentĂ©s sorĂˇn (email lehet, hogy mĂˇr foglalt).');
                                    },
                                    });
                                }
                                }

                                HTML

                                div class="container mt-4">
                                    div class="card bg-dark text-light border-secondary">
                                        div class="card-body">
                                            h2 class="card-title mb-4">Ăšj diĂˇk felvĂ©tele</h2>
                                            form (ngSubmit)="createDiak()">
                                                !-- VezetĂ©knĂ©v + KeresztnĂ©v -->
                                                div class="row g-3 mb-3">
                                                    div class="col-md-6">
                                                        div class="form-floating">
                                                            input type="text" class="form-control" id="vezeteknev" placeholder="VezetĂ©knĂ©v" required
                                                                name="vezeteknev" [(ngModel)]="form.vezeteknev" />
                                                            label for="vezeteknev">VezetĂ©knĂ©v</label>
                                                        /div>
                                                    /div>
                                                    div class="col-md-6">
                                                        div class="form-floating">
                                                            input type="text" class="form-control" id="keresztnev" placeholder="KeresztnĂ©v" required
                                                                name="keresztnev" [(ngModel)]="form.keresztnev" />
                                                            label for="keresztnev">KeresztnĂ©v</label>
                                                        /div>
                                                    /div>
                                                /div>
                                                !-- Email -->
                                                div class="form-floating mb-3">
                                                    input type="email" class="form-control" id="email" placeholder="Email" required name="email"
                                                        [(ngModel)]="form.email" />
                                                    label for="email">Email</label>
                                                /div>
                                                !-- OsztĂˇly -->
                                                div class="form-floating mb-3">
                                                    select class="form-select" id="osztaly" required name="osztaly_id" [(ngModel)]="form.osztaly_id">
                                                        option value="" disabled>VĂˇlassz osztĂˇlyt</option>
                                                        option *ngFor="let o of osztalyok" [value]="o.id">
                                                            {{ o.nev }}
                                                        /option>
                                                    /select>
                                                    label for="osztaly">OsztĂˇly</label>
                                                /div>
                                                !-- SzĂĽletĂ©si dĂˇtum -->
                                                div class="form-floating mb-4">
                                                    input type="date" class="form-control" id="szuletesiDatum" placeholder="SzĂĽletĂ©si dĂˇtum"
                                                        name="szuletesi_datum" [(ngModel)]="form.szuletesi_datum" />
                                                    label for="szuletesiDatum">SzĂĽletĂ©si dĂˇtum</label>
                                                /div >
                                                div class="d-flex gap-3">
                                                    button type="submit" class="btn btn-primary flex-fill">
                                                        MentĂ©s
                                                    /button>
                                                    button type="button" class="btn btn-danger flex-fill" [routerLink]="['/']">
                                                        MĂ©gse
                                                    /button>
                                                /div>
                                            /form>
                                        /div>
                                    /div>
                                /div>

                                TS

                                import { CommonModule } from '@angular/common';
                                import { Component, OnInit } from '@angular/core';
                                import { Api } from '../../services/api';
                                import { FormsModule } from '@angular/forms';
                                import { Osztaly } from '../../models/osztaly';
                                import { ActivatedRoute, Router, RouterLink } from '@angular/router';

                                @Component({
                                selector: 'app-diak-szerkesztes',
                                imports: [CommonModule, FormsModule],
                                templateUrl: './diak-szerkesztes.html',
                                styleUrl: './diak-szerkesztes.css',
                                })
                                export class DiakSzerkesztes implements OnInit {
                                diakId = 0;
                                osztalyok: Osztaly[] = [];
                                // Ugyanaz az Ĺ±rlapmodell, mint lĂ©trehozĂˇsnĂˇl
                                form = {
                                    vezeteknev: '',
                                    keresztnev: '',
                                    email: '',
                                    osztaly_id: 0,
                                    szuletesi_datum: '',
                                };
                                constructor(
                                    private api: Api,
                                    private route: ActivatedRoute,
                                    private router: Router,
                                ) {}
                                ngOnInit(): void {
                                    // ID kiolvasĂˇsa az URL-bĹ‘l
                                    this.diakId = Number(this.route.snapshot.paramMap.get('id'));
                                    if (!this.diakId) {
                                    alert('HiĂˇnyzĂł diĂˇk azonosĂ­tĂł.');
                                    this.router.navigate(['/']);
                                    return;
                                    }
                                    this.loadOsztalyok();
                                    this.loadDiak();
                                }
                                loadOsztalyok(): void {
                                    this.api.getOsztalyok().subscribe({
                                    next: (res) => {
                                        this.osztalyok = res.data;
                                    },
                                    error: () => {
                                        alert('Nem sikerĂĽlt betĂ¶lteni az osztĂˇlyokat.');
                                    },
                                    });
                                }
                                loadDiak(): void {
                                    this.api.getDiakById(this.diakId).subscribe({
                                    next: (res) => {
                                        const d = res.data;
                                        // Ĺ±rlap elĹ‘tĂ¶ltĂ©se
                                        this.form = {
                                        vezeteknev: d.vezeteknev,
                                        keresztnev: d.keresztnev,
                                        email: d.email,
                                        osztaly_id: d.osztaly_id,
                                        szuletesi_datum: d.szuletesi_datum ?? '',
                                        };
                                    },
                                    error: () => {
                                        alert('A diĂˇk adatai nem tĂ¶lthetĹ‘k be.');
                                        this.router.navigate(['/']);
                                    },
                                    });
                                }
                                updateDiak(): void {
                                    if (
                                    !this.form.vezeteknev ||
                                    !this.form.keresztnev ||
                                    !this.form.email ||
                                    this.form.osztaly_id <= 0
                                    ) {
                                    alert('TĂ¶ltsd ki a kĂ¶telezĹ‘ mezĹ‘ket!');
                                    return;
                                    }
                                    const payload = {
                                    vezeteknev: this.form.vezeteknev.trim(),
                                    keresztnev: this.form.keresztnev.trim(),
                                    email: this.form.email.trim(),
                                    osztaly_id: Number(this.form.osztaly_id),
                                    szuletesi_datum: this.form.szuletesi_datum === '' ? null : this.form.szuletesi_datum,
                                    };
                                    this.api.updateDiak(this.diakId, payload).subscribe({
                                    next: () => {
                                        alert('Sikeres mĂłdosĂ­tĂˇs.');
                                        this.router.navigate(['/']);
                                    },
                                    error: () => {
                                        alert('Hiba tĂ¶rtĂ©nt a mĂłdosĂ­tĂˇs sorĂˇn.');
                                    },
                                    });
                                }
                                }

                                HTML

                                div class="container mt-4">
                                    div class="card bg-dark text-light border-secondary">
                                        div class="card-body">
                                            h2 class="card-title mb-4">DiĂˇk szerkesztĂ©se</h2>
                                            form (ngSubmit)="updateDiak()">
                                                !-- VezetĂ©knĂ©v + KeresztnĂ©v -->
                                                div class="row g-3 mb-3">
                                                    div class="col-md-6">
                                                        div class="form-floating">
                                                            input type="text" class="form-control" id="vezeteknev" placeholder="VezetĂ©knĂ©v" required
                                                                name="vezeteknev" [(ngModel)]="form.vezeteknev" />
                                                            label for="vezeteknev">VezetĂ©knĂ©v</label>
                                                        /div>
                                                    /div>
                                                    div class="col-md-6">
                                                        div class="form-floating">
                                                            input type="text" class="form-control" id="keresztnev" placeholder="KeresztnĂ©v" required
                                                                name="keresztnev" [(ngModel)]="form.keresztnev" />
                                                            label for="keresztnev">KeresztnĂ©v</label>
                                                        /div>
                                                    /div>
                                                /div>
                                                !-- Email -->
                                                div class="form-floating mb-3">
                                                    input type="email" class="form-control" id="email" placeholder="Email" required name="email"
                                                        [(ngModel)]="form.email" />
                                                    label for="email">Email</label>
                                                /div>
                                                !-- OsztĂˇly -->
                                                div class="form-floating mb-3">
                                                    select class="form-select" id="osztaly" required name="osztaly_id" [(ngModel)]="form.osztaly_id">
                                                        option value="" disabled>VĂˇlassz osztĂˇlyt</option>
                                                        option *ngFor="let o of osztalyok" [value]="o.id">
                                                            {{ o.nev }}
                                                        /option>
                                                    /select>
                                                    label for="osztaly">OsztĂˇly</label>
                                                /div>
                                                !-- SzĂĽletĂ©si dĂˇtum -->
                                                div class="form-floating mb-4">
                                                    input type="date" class="form-control" id="szuletesiDatum" placeholder="SzĂĽletĂ©si dĂˇtum"
                                                        name="szuletesi_datum" [(ngModel)]="form.szuletesi_datum" />
                                                    label for="szuletesiDatum">SzĂĽletĂ©si dĂˇtum</label>
                                                /div>
                                                !-- MentĂ©s gomb -->
                                                button type="submit" class="btn btn-primary w-100">
                                                    MentĂ©s
                                                /button>
                                            /form>
                                        /div>
                                    /div>
                                /div>

                                ***********************************************
                                app.html
                                ***********************************************
                                !-- FelsĹ‘ navigĂˇciĂł -->
                                nav class="navbar navbar-expand navbar-dark bg-dark">
                                    div class="container-fluid">
                                        span class="navbar-brand">
                                            Iskola â€“ DiĂˇkok
                                        /span>
                                        div class="ms-auto">
                                            a class="btn btn-primary" routerLink="/diakletrehozas">
                                                + Ăšj diĂˇk
                                            /a>
                                        /div>
                                    /div>
                                /nav>
                                !-- Oldaltartalom -->
                                div class="container-fluid mt-3">
                                    router-outlet></router-outlet>
                                /div>

                                ________________________________________
                                *******************************************
                                Route app.routes.ts
                                *******************************************
                                import { Routes } from '@angular/router';
                                import { DiakokLista } from './components/diakok-lista/diakok-lista';
                                import { DiakSzerkesztes } from './components/diak-szerkesztes/diak-szerkesztes';
                                import { DiakLetrehozas } from './components/diak-letrehozas/diak-letrehozas';
                                import { Hiba } from './components/hiba/hiba';

                                export const routes: Routes = [
                                { path: '', component: DiakokLista},
                                { path: 'diakszerkesztes/:id', component: DiakSzerkesztes},
                                { path: 'diakletrehozas', component: DiakLetrehozas},
                                { path: '**', component: Hiba }
                                ];

                                ________________________________________
                                3ď¸ŹâŁ Service lĂ©trehozĂˇsa az API hĂ­vĂˇshoz
                                Angularban Ă©rdemes service-ben kezelni az API hĂ­vĂˇsokat:
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
                                4ď¸ŹâŁ Komponensben az adatok lekĂ©rĂ©se

                                ***********************************************
                                No Standalone
                                ***********************************************
                                // users.component.ts
                                import { Component, OnInit } from '@angular/core';
                                import { UserService } from './user.service';

                                @Component({
                                selector: 'app-users',
                                templateUrl: './users.component.html'
                                styleUrl: './users.component.css'
                                })
                                export class UsersComponent implements OnInit {
                                users: any[] = []; // ide tĂ¶ltjĂĽk az adatokat

                                constructor(private userService: UserService) {}

                                ngOnInit(): void {
                                    this.userService.getUsers().subscribe({
                                    next: (data) => {
                                        this.users = data; // itt tĂ¶ltjĂĽk a vĂˇltozĂłba
                                    },
                                    error: (err) => {
                                        console.error('Hiba az adatok lekĂ©rĂ©sekor:', err);
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
                                styleUrl: './users.component.css'
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
                                        console.error('Hiba az adatok lekĂ©rĂ©sekor:', err);
                                    }
                                    });
                                }
                                }
                                
                                ________________________________________
                                5ď¸ŹâŁ Template-ben a megjelenĂ­tĂ©s
                                <!-- users.component.html -->
                                ul>
                                li *ngFor="let user of users">
                                    {{ user.name }} - {{ user.email }}
                                /li>
                                /ul>
