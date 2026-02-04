import { Routes } from '@angular/router';
import { DiakokLista } from './components/diakok-lista/diakok-lista';
import { DiakSzerkesztes } from './components/diak-szerkesztes/diak-szerkesztes';
import { DiakLetrehozas } from './components/diak-letrehozas/diak-letrehozas';

export const routes: Routes = [
{ path: '', component: DiakokLista},
{ path: 'diakszerkesztes/:id', component: DiakSzerkesztes},
{ path: 'diakletrehozas', component: DiakLetrehozas}
];
