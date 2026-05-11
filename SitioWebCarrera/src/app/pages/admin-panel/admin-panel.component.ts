import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

type SectionKey = 'docentes' | 'egresados' | 'proyectos' | 'galeria' | 'noticias' | 'eventos';
type FieldType = 'text' | 'number' | 'email' | 'date' | 'textarea' | 'select' | 'url';

interface AdminField {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
  wide?: boolean;
}

interface AdminSection {
  key: SectionKey;
  label: string;
  endpoint: string;
  idKey: string;
  titleKey: string;
  tableColumns: { key: string; label: string }[];
  fields: AdminField[];
}

const API_BASE_URL = 'http://localhost:3000/api';
const TOKEN_KEY = 'admin_panel_token';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);

  readonly sections: AdminSection[] = [
    {
      key: 'docentes',
      label: 'Docentes',
      endpoint: `${API_BASE_URL}/docentes`,
      idKey: 'id',
      titleKey: 'nombre',
      tableColumns: [
        { key: 'nombre', label: 'Nombre' },
        { key: 'especialidad', label: 'Especialidad' },
        { key: 'email', label: 'Correo' }
      ],
      fields: [
        { key: 'nombre', label: 'Nombre', type: 'text', required: true },
        { key: 'especialidad', label: 'Especialidad', type: 'text', required: true },
        { key: 'cargo', label: 'Cargo', type: 'textarea', required: true, wide: true },
        { key: 'imagen', label: 'URL de imagen', type: 'url', required: true, wide: true },
        { key: 'email', label: 'Correo', type: 'email', required: true },
        { key: 'descripcion', label: 'Descripcion', type: 'textarea', required: true, wide: true },
        {
          key: 'publicacionesTexto',
          label: 'Publicaciones',
          type: 'textarea',
          wide: true,
          placeholder: 'Una por linea: Titulo | 2024 | https://enlace.com'
        }
      ]
    },
    {
      key: 'egresados',
      label: 'Egresados',
      endpoint: `${API_BASE_URL}/egresados`,
      idKey: 'id',
      titleKey: 'nombre',
      tableColumns: [
        { key: 'nombre', label: 'Nombre' },
        { key: 'anio', label: 'Anio' },
        { key: 'modalidad', label: 'Modalidad' }
      ],
      fields: [
        { key: 'nombre', label: 'Nombre', type: 'text', required: true },
        { key: 'anio', label: 'Anio', type: 'number', required: true },
        {
          key: 'modalidad',
          label: 'Modalidad',
          type: 'select',
          required: true,
          options: [
            { label: 'Tesis', value: 'tesis' },
            { label: 'CENEVAL', value: 'ceneval' },
            { label: 'Experiencia profesional', value: 'experiencia' }
          ]
        }
      ]
    },
    {
      key: 'proyectos',
      label: 'Proyectos',
      endpoint: `${API_BASE_URL}/proyectos`,
      idKey: 'id',
      titleKey: 'title',
      tableColumns: [
        { key: 'title', label: 'Titulo' },
        { key: 'categoryLabel', label: 'Categoria' },
        { key: 'summary', label: 'Resumen' }
      ],
      fields: [
        { key: 'title', label: 'Titulo', type: 'text', required: true },
        {
          key: 'categoryKey',
          label: 'Categoria',
          type: 'select',
          required: true,
          options: [
            { label: 'Desarrollo de Software', value: 'software' },
            { label: 'Sistemas Inteligentes', value: 'sistemas' }
          ]
        },
        { key: 'summary', label: 'Resumen', type: 'textarea', required: true, wide: true },
        { key: 'image', label: 'URL de imagen', type: 'url', required: true, wide: true },
        { key: 'videoUrl', label: 'URL de video', type: 'url', wide: true },
        { key: 'description', label: 'Descripcion', type: 'textarea', required: true, wide: true },
        {
          key: 'miembrosTexto',
          label: 'Miembros',
          type: 'textarea',
          wide: true,
          placeholder: 'Un nombre por linea'
        },
        {
          key: 'galeriaTexto',
          label: 'Galeria del proyecto',
          type: 'textarea',
          wide: true,
          placeholder: 'Una URL de imagen por linea'
        }
      ]
    },
    {
      key: 'galeria',
      label: 'Galeria',
      endpoint: `${API_BASE_URL}/galeria`,
      idKey: 'id',
      titleKey: 'titulo',
      tableColumns: [
        { key: 'titulo', label: 'Titulo' },
        { key: 'categoria', label: 'Categoria' },
        { key: 'tipo', label: 'Tipo' },
        { key: 'url', label: 'URL' }
      ],
      fields: [
        { key: 'titulo', label: 'Titulo', type: 'text' },
        { key: 'categoria', label: 'Categoria', type: 'text' },
        { key: 'url', label: 'URL de imagen/video', type: 'url', required: true, wide: true },
        {
          key: 'tipo',
          label: 'Tipo',
          type: 'select',
          required: true,
          options: [
            { label: 'Imagen', value: 'imagen' },
            { label: 'Video', value: 'video' }
          ]
        }
      ]
    },
    {
      key: 'noticias',
      label: 'Noticias',
      endpoint: `${API_BASE_URL}/noticias`,
      idKey: 'id',
      titleKey: 'titulo',
      tableColumns: [
        { key: 'titulo', label: 'Titulo' },
        { key: 'fechaTexto', label: 'Fecha' },
        { key: 'descripcion', label: 'Descripcion' }
      ],
      fields: [
        { key: 'titulo', label: 'Titulo', type: 'text', required: true },
        { key: 'fecha', label: 'Fecha', type: 'date' },
        { key: 'imagenUrl', label: 'URL de imagen', type: 'url', wide: true },
        { key: 'descripcion', label: 'Descripcion corta', type: 'textarea', wide: true },
        { key: 'contenido', label: 'Contenido', type: 'textarea', required: true, wide: true }
      ]
    },
    {
      key: 'eventos',
      label: 'Eventos',
      endpoint: `${API_BASE_URL}/eventos`,
      idKey: 'id',
      titleKey: 'titulo',
      tableColumns: [
        { key: 'titulo', label: 'Titulo' },
        { key: 'dia', label: 'Dia' },
        { key: 'mes', label: 'Mes' },
        { key: 'lugar', label: 'Lugar' }
      ],
      fields: [
        { key: 'titulo', label: 'Titulo', type: 'text', required: true },
        { key: 'descripcion', label: 'Descripcion', type: 'textarea', required: true, wide: true },
        { key: 'fecha', label: 'Fecha', type: 'date', required: true },
        { key: 'hora', label: 'Hora', type: 'text' },
        { key: 'lugar', label: 'Lugar', type: 'text' }
      ]
    }
  ];

  activeKey = signal<SectionKey>('docentes');
  records = signal<any[]>([]);
  loading = signal(false);
  formVisible = signal(false);
  editingRecord = signal<any | null>(null);
  message = signal('');
  error = signal('');
  token = signal(localStorage.getItem(TOKEN_KEY) || '');

  activeSection = computed(() => this.sections.find((section) => section.key === this.activeKey())!);
  isAuthenticated = computed(() => Boolean(this.token()));

  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  dataForm = this.fb.group({});

  constructor() {
    if (this.isAuthenticated()) {
      this.loadSection();
    }
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.error.set('');
    this.http.post<{ token: string }>(`${API_BASE_URL}/auth/login`, this.loginForm.getRawValue()).subscribe({
      next: ({ token }) => {
        localStorage.setItem(TOKEN_KEY, token);
        this.token.set(token);
        this.message.set('Sesion iniciada.');
        this.loadSection();
      },
      error: () => this.error.set('No se pudo iniciar sesion. Revisa usuario y contrasena.')
    });
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.token.set('');
    this.records.set([]);
    this.formVisible.set(false);
    this.message.set('');
  }

  selectSection(key: SectionKey): void {
    this.activeKey.set(key);
    this.cancelForm();
    this.loadSection();
  }

  loadSection(): void {
    this.loading.set(true);
    this.error.set('');

    this.http.get<any[]>(this.activeSection().endpoint).subscribe({
      next: (records) => {
        this.records.set(Array.isArray(records) ? records : []);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(`No se pudieron cargar los registros de ${this.activeSection().label}.`);
        this.loading.set(false);
      }
    });
  }

  openCreateForm(): void {
    this.editingRecord.set(null);
    this.buildForm();
    this.formVisible.set(true);
  }

  openEditForm(record: any): void {
    this.editingRecord.set(record);
    this.buildForm(record);
    this.formVisible.set(true);
  }

  cancelForm(): void {
    this.formVisible.set(false);
    this.editingRecord.set(null);
    this.dataForm = this.fb.group({});
  }

  submitForm(): void {
    if (this.dataForm.invalid) {
      this.dataForm.markAllAsTouched();
      return;
    }

    const record = this.editingRecord();
    const payload = this.buildPayload(this.dataForm.getRawValue());
    const request = record
      ? this.http.put(`${this.activeSection().endpoint}/${record[this.activeSection().idKey]}`, payload, {
          headers: this.authHeaders()
        })
      : this.http.post(this.activeSection().endpoint, payload, { headers: this.authHeaders() });

    request.subscribe({
      next: () => {
        this.message.set(record ? 'Registro actualizado.' : 'Registro creado.');
        this.cancelForm();
        this.loadSection();
      },
      error: (error) => this.error.set(this.describeHttpError(error, 'No se pudo guardar.'))
    });
  }

  deleteRecord(record: any): void {
    const title = this.displayValue(record, this.activeSection().titleKey) || 'este registro';
    const confirmed = window.confirm(`Eliminar "${title}"? Esta accion no se puede deshacer.`);

    if (!confirmed) {
      return;
    }

    this.http
      .delete(`${this.activeSection().endpoint}/${record[this.activeSection().idKey]}`, {
        headers: this.authHeaders()
      })
      .subscribe({
        next: () => {
          this.message.set('Registro eliminado.');
          this.loadSection();
        },
        error: (error) => this.error.set(this.describeHttpError(error, 'No se pudo eliminar.'))
      });
  }

  displayValue(record: any, key: string): string {
    const value = record?.[key];

    if (value === null || value === undefined || value === '') {
      return '-';
    }

    if (Array.isArray(value)) {
      return `${value.length} elemento(s)`;
    }

    return String(value);
  }

  private buildForm(record?: any): void {
    const controls: Record<string, any> = {};

    for (const field of this.activeSection().fields) {
      controls[field.key] = [
        this.valueForField(field.key, record),
        field.required ? Validators.required : []
      ];
    }

    this.dataForm = this.fb.group(controls);
  }

  private valueForField(key: string, record?: any): string | number {
    if (!record) {
      return '';
    }

    if (key === 'publicacionesTexto') {
      return (record.publicaciones || [])
        .map((item: any) => `${item.titulo || ''} | ${item.anio || ''} | ${item.enlace || ''}`)
        .join('\n');
    }

    if (key === 'miembrosTexto') {
      return (record.miembros || []).map((item: any) => item.nombre || item).join('\n');
    }

    if (key === 'galeriaTexto') {
      return (record.galeria || []).map((item: any) => item.url || item).join('\n');
    }

    if (key === 'fecha' && record.fecha) {
      return String(record.fecha).slice(0, 10);
    }

    return record[key] ?? '';
  }

  private buildPayload(rawValue: any): any {
    const payload = { ...rawValue };

    if ('anio' in payload && payload.anio !== '') {
      payload.anio = Number(payload.anio);
    }

    if ('dia' in payload && payload.dia !== '') {
      payload.dia = Number(payload.dia);
    }

    if ('mes' in payload && payload.mes !== '') {
      payload.mes = Number(payload.mes);
    }

    if (payload.categoryKey) {
      payload.categoryLabel = this.categoryLabel(payload.categoryKey);
    }

    if ('publicacionesTexto' in payload) {
      payload.publicaciones = this.parsePublicaciones(payload.publicacionesTexto);
      delete payload.publicacionesTexto;
    }

    if ('miembrosTexto' in payload) {
      payload.miembros = this.parseLines(payload.miembrosTexto).map((nombre) => ({ nombre }));
      delete payload.miembrosTexto;
    }

    if ('galeriaTexto' in payload) {
      payload.galeria = this.parseLines(payload.galeriaTexto).map((url) => ({ url }));
      delete payload.galeriaTexto;
    }

    for (const key of Object.keys(payload)) {
      if (payload[key] === '') {
        payload[key] = undefined;
      }
    }

    return payload;
  }

  private categoryLabel(categoryKey: string): string {
    if (categoryKey === 'software') {
      return 'Desarrollo de Software';
    }

    if (categoryKey === 'sistemas') {
      return 'Sistemas Inteligentes';
    }

    return categoryKey;
  }

  private parsePublicaciones(value: string): any[] {
    return this.parseLines(value).map((line) => {
      const [titulo = '', anio = '', enlace = '#'] = line.split('|').map((part) => part.trim());

      return {
        titulo,
        anio: Number(anio) || new Date().getFullYear(),
        enlace: enlace || '#'
      };
    });
  }

  private parseLines(value: string): string[] {
    return String(value || '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token()}`
    });
  }

  private describeHttpError(error: HttpErrorResponse, fallback: string): string {
    const backendMessage = error.error?.error || error.message;

    if (error.status === 401) {
      return `${fallback} La sesion expiro o el token no es valido. Cierra sesion y vuelve a entrar.`;
    }

    return backendMessage ? `${fallback} ${backendMessage}` : `${fallback} Verifica los datos.`;
  }
}
