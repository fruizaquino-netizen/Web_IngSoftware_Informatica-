import { Component, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslationService } from '../../services/translation.service';

// Interfaz para las publicaciones científicas
interface Publicacion {
  titulo: string;
  anio: number;
  enlace: string;
}

// Interfaz extendida para el Docente
interface Docente {
  nombre: string;
  especialidad: string;
  cargo: string;
  imagen: string;
  descripcion: string;
  email: string;
  publicaciones: Publicacion[];
}

const defaultContent = {
  DOCENTES: {
    TITLE: 'Docentes universitarios',
    SUBTITLE: 'Liderazgo académico y experiencia profesional al servicio de tu formación.',
    VIEW_PROFILE: 'Ver Perfil',
    EMAIL_LABEL: 'Correo Electrónico',
    PRO_DESCRIPTION: 'Descripción Profesional',
    PUBLICATIONS: 'Publicaciones Científicas',
    TABLE_TITLE: 'Título',
    TABLE_YEAR: 'Año',
    TABLE_ACTION: 'Acción',
    VIEW: 'Ver',
    NO_PUBLICATIONS: 'No hay publicaciones registradas actualmente.'
  }
};

@Component({
  selector: 'docentes',
  templateUrl: './docentes-pages.component.html',
  styleUrls: ['./docentes-pages.component.css']
})
export class DocentesPageComponent {
  private http = inject(HttpClient);
  private translation = inject(TranslationService);

  public content = signal(defaultContent);

  // Signal para controlar qué docente se muestra en el detalle (modal)
  public docenteSeleccionado = signal<Docente | null>(null);

  // Signal con la lista completa de docentes y sus trayectorias
  public docentes = signal<Docente[]>([]);

  constructor() {
    effect(() => {
      const lang = this.translation.currentLang();
      const fileLang = lang === 'en' ? 'en' : lang === 'zapoteco' ? 'zapoteco' : 'es';
      this.http
        .get(`assets/i18n/docentes.${fileLang}.json`)
        .subscribe((data) => {
          const typed = data as { DOCENTES: typeof defaultContent.DOCENTES; DOCENTES_LIST?: Docente[] };
          this.content.set({ DOCENTES: typed.DOCENTES ?? defaultContent.DOCENTES });
          this.docentes.set(typed.DOCENTES_LIST ?? []);
        });
    });
  }

  /**
   * Abre el modal asignando el docente seleccionado
   */
  public abrirPerfil(docente: Docente): void {
    this.docenteSeleccionado.set(docente);
    // Opcional: Bloquear el scroll del body al abrir el modal
    document.body.style.overflow = 'hidden';
  }

  /**
   * Cierra el modal limpiando el signal
   */
  public cerrarPerfil(): void {
    this.docenteSeleccionado.set(null);
    // Restaurar el scroll del body
    document.body.style.overflow = 'auto';
  }
}
