import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface Publicacion {
  titulo: string;
  anio: number;
  enlace: string;
}

interface Docente {
  nombre: string;
  especialidad: string;
  cargo: string;
  imagen: string;
  descripcion: string;
  email: string;
  telefono?: string;
  publicaciones: Publicacion[];
}

@Component({
  selector: 'app-docentes-perfil',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './docentes-perfil.component.html',
  styleUrls: ['./docentes-perfil.component.css']
})
export class DocentesPerfilComponent {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  private readonly docentesApiUrl = 'http://localhost:3000/api/docentes';

  public readonly cargando = signal(true);
  public readonly error = signal('');
  public readonly docentes = signal<Docente[]>([]);
  public readonly nombreRuta = signal(this.route.snapshot.paramMap.get('nombre') || '');

  public readonly docente = computed(() => {
    const nombre = decodeURIComponent(this.nombreRuta()).trim().toLowerCase();

    return this.docentes().find((docente) => {
      return docente.nombre.trim().toLowerCase() === nombre;
    }) || null;
  });

  constructor() {
    this.cargarDocentes();
  }

  private cargarDocentes(): void {
    this.http.get<Docente[]>(this.docentesApiUrl).subscribe({
      next: (docentes) => {
        this.docentes.set(Array.isArray(docentes) ? docentes : []);
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar el perfil del docente:', error);
        this.error.set('No se pudo cargar la informacion del docente.');
        this.cargando.set(false);
      }
    });
  }
}
