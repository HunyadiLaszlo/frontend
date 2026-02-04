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
  // Ugyanaz az űrlapmodell, mint létrehozásnál
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
    // ID kiolvasása az URL-ből
    this.diakId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.diakId) {
      alert('Hiányzó diák azonosító.');
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
        alert('Nem sikerült betölteni az osztályokat.');
      },
    });
  }
  loadDiak(): void {
    this.api.getDiakById(this.diakId).subscribe({
      next: (res) => {
        const d = res.data;
        // űrlap előtöltése
        this.form = {
          vezeteknev: d.vezeteknev,
          keresztnev: d.keresztnev,
          email: d.email,
          osztaly_id: d.osztaly_id,
          szuletesi_datum: d.szuletesi_datum ?? '',
        };
      },
      error: () => {
        alert('A diák adatai nem tölthetők be.');
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
      alert('Töltsd ki a kötelező mezőket!');
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
        alert('Sikeres módosítás.');
        this.router.navigate(['/']);
      },
      error: () => {
        alert('Hiba történt a módosítás során.');
      },
    });
  }
}
