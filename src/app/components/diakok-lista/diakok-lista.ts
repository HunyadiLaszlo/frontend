import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-diakok-lista',
  imports: [CommonModule, RouterModule],
  templateUrl: './diakok-lista.html',
  styleUrl: './diakok-lista.css',
})
export class DiakokLista implements OnInit {
  diakok: any[] = [];
  loading = false;
  error = '';
  constructor(private api: Api) {}
  ngOnInit(): void {
    this.loadDiakok();
  }
  loadDiakok(): void {
    this.loading = true;
    this.error = '';
    this.api.getDiakok().subscribe({
      next: (res) => {
        this.diakok = res.data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Hiba történt a diákok betöltésekor.';
        this.loading = false;
      },
    });
  }

  //Tanuló törlése, így ehhez a funkcióhoz nem kell külön komponens
  deleteDiak(id: number): void {
    if (!confirm('Biztosan törlöd a kiválasztott diákot?')) return;
    this.api.deleteDiak(id).subscribe({
      next: () => {
        // újratöltjük a listát, hogy azonnal eltűnjön a sor
        this.loadDiakok();
      },
      error: () => {
        alert('Hiba történt a törlés során.');
      },
    });
  }
}
