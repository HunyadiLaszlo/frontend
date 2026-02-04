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
  // Osztályok a legördülőhöz
  osztalyok: Osztaly[] = [];
  // Egyszerű "űrlapmodell" (template-driven irány, FormsModule majd később)
  form = {
    vezeteknev: '',
    keresztnev: '',
    email: '',
    osztaly_id: 0,
    szuletesi_datum: '', // üres string is ok (backend null-ként kezeli, ha üresen küldjük vagy kihagyjuk)
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
        alert('Nem sikerült betölteni az osztályokat.');
      },
    });
  }
  createDiak(): void {
    // Minimál validáció (HTML-ben is lesz required)
    if (
      !this.form.vezeteknev ||
      !this.form.keresztnev ||
      !this.form.email ||
      this.form.osztaly_id <= 0
    ) {
      alert('Töltsd ki a kötelező mezőket!');
      return;
    }
    // Payload összeállítás: ha a dátum üres, küldjük null-ként
    const payload = {
      vezeteknev: this.form.vezeteknev.trim(),
      keresztnev: this.form.keresztnev.trim(),
      email: this.form.email.trim(),
      osztaly_id: Number(this.form.osztaly_id),
      szuletesi_datum: !this.form.szuletesi_datum ? null : this.form.szuletesi_datum.trim(),
    };
    this.api.createDiak(payload).subscribe({
      next: () => {
        alert('Sikeres mentés!');
        // Űrlap ürítése
        this.form = {
          vezeteknev: '',
          keresztnev: '',
          email: '',
          osztaly_id: 0,
          szuletesi_datum: '',
        };
      },
      error: () => {
        alert('Hiba történt a mentés során (email lehet, hogy már foglalt).');
      },
    });
  }
}
