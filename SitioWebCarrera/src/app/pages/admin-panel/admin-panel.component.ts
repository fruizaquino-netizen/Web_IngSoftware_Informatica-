import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationStart, Router, RouterLink } from '@angular/router';
import { Subscription, filter } from 'rxjs';

type SectionKey = 'docentes' | 'egresados' | 'usuarios' | 'proyectos' | 'galeria' | 'noticias' | 'eventos';
type FieldType = 'text' | 'number' | 'email' | 'date' | 'textarea' | 'select' | 'file' | 'password';

interface AdminField {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
  wide?: boolean;
  multiple?: boolean;
  accept?: string;
  otherKey?: string;
}

interface AdminSection {
  key: SectionKey;
  label: string;
  endpoint: string;
  idKey: string;
  titleKey: string;
  canReorder?: boolean;
  tableColumns: { key: string; label: string }[];
  fields: AdminField[];
}

const API_BASE_URL = 'http://localhost:3000/api';
const TOKEN_KEY = 'admin_panel_token';
const CUSTOM_OPTIONS_KEY = 'admin_panel_custom_options';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private noticeTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly routerSubscription: Subscription;

  readonly sections: AdminSection[] = [
    {
      key: 'docentes',
      label: 'Docentes',
      endpoint: `${API_BASE_URL}/docentes`,
      idKey: 'id',
      titleKey: 'nombre',
      canReorder: true,
      tableColumns: [
        { key: 'nombre', label: 'Nombre' },
        { key: 'apellidos', label: 'Apellidos' },
        { key: 'especialidad', label: 'Especialidad' },
        { key: 'email', label: 'Correo' }
      ],
      fields: [
        { key: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Ej. Ana Maria' },
        { key: 'apellidos', label: 'Apellidos', type: 'text', required: true, placeholder: 'Ej. Perez Lopez' },
        {
          key: 'especialidad',
          label: 'Especialidad',
          type: 'select',
          required: true,
          otherKey: 'especialidadOtro',
          options: [
            { label: 'Desarrollo de Software', value: 'Desarrollo de Software' },
            { label: 'Sistemas Inteligentes', value: 'Sistemas Inteligentes' },
            { label: 'Redes y Telecomunicaciones', value: 'Redes y Telecomunicaciones' },
            { label: 'Otros', value: 'Otros' }
          ]
        },
        {
          key: 'cargo',
          label: 'Cargo',
          type: 'select',
          required: true,
          wide: true,
          otherKey: 'cargoOtro',
          options: [
            { label: 'Profesor investigador de tiempo completo', value: 'Profesor investigador de tiempo completo' },
            { label: 'Profesor de asignatura', value: 'Profesor de asignatura' },
            { label: 'Jefe de carrera', value: 'Jefe de carrera' },
            { label: 'Otros', value: 'Otros' }
          ]
        },
        { key: 'imagen', label: 'Imagen', type: 'file', required: true, wide: true, accept: 'image/*' },
        { key: 'email', label: 'Correo', type: 'email', required: true, placeholder: 'correo@unistmo.edu.mx' },
        { key: 'descripcion', label: 'Descripcion', type: 'textarea', required: true, wide: true, placeholder: 'Describe brevemente su perfil academico.' },
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
      canReorder: true,
      tableColumns: [
        { key: 'nombre', label: 'Nombre' },
        { key: 'apellidos', label: 'Apellidos' },
        { key: 'anio', label: 'Año' },
        { key: 'modalidad', label: 'Modalidad' }
      ],
      fields: [
        { key: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Ej. Carlos' },
        { key: 'apellidos', label: 'Apellidos', type: 'text', required: true, placeholder: 'Ej. Gomez Ruiz' },
        { key: 'anio', label: 'Año', type: 'number', required: true, placeholder: 'Ej. 2024' },
        { key: 'foto', label: 'Foto de perfil', type: 'file', wide: true, accept: 'image/*' },
        {
          key: 'modalidad',
          label: 'Modalidad',
          type: 'select',
          required: true,
          otherKey: 'modalidadOtro',
          options: [
            { label: 'Tesis', value: 'tesis' },
            { label: 'CENEVAL', value: 'ceneval' },
            { label: 'Experiencia profesional', value: 'experiencia' },
            { label: 'Otros', value: 'Otros' }
          ]
        }
      ]
    },
    {
      key: 'usuarios',
      label: 'Usuarios',
      endpoint: `${API_BASE_URL}/usuarios`,
      idKey: 'id',
      titleKey: 'usuario',
      canReorder: false,
      tableColumns: [
        { key: 'usuario', label: 'Usuario' },
        { key: 'role', label: 'Rol' }
      ],
      fields: [
        { key: 'usuario', label: 'Usuario', type: 'text', required: true, placeholder: 'Ej. admin' },
        { key: 'password', label: 'Contraseña', type: 'password', required: true, placeholder: 'Crea una contraseña segura' },
        {
          key: 'role',
          label: 'Rol',
          type: 'select',
          required: true,
          options: [
            { label: 'Administrador', value: 'admin' },
            { label: 'Editor', value: 'editor' }
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
      canReorder: true,
      tableColumns: [
        { key: 'title', label: 'Titulo' },
        { key: 'categoria', label: 'Categoria' },
        { key: 'summary', label: 'Resumen' }
      ],
      fields: [
        { key: 'title', label: 'Titulo', type: 'text', required: true, placeholder: 'Ej. Plataforma de seguimiento academico' },
        {
          key: 'categoria',
          label: 'Categoria',
          type: 'select',
          required: true,
          otherKey: 'categoriaOtro',
          options: [
            { label: 'Desarrollo de Software', value: 'Desarrollo de Software' },
            { label: 'Sistemas Inteligentes', value: 'Sistemas Inteligentes' },
            { label: 'Otros', value: 'Otros' }
          ]
        },
        { key: 'summary', label: 'Resumen', type: 'textarea', required: true, wide: true, placeholder: 'Resume el objetivo del proyecto en una o dos frases.' },
        { key: 'imagenPortada', label: 'Imagen de portada', type: 'file', required: true, wide: true, accept: 'image/*' },
        { key: 'description', label: 'Descripcion', type: 'textarea', required: true, wide: true, placeholder: 'Describe el problema, la solucion y los resultados principales.' },
        {
          key: 'miembrosTexto',
          label: 'Miembros',
          type: 'select',
          wide: true,
          multiple: true,
          otherKey: 'miembroOtro',
          placeholder: 'Selecciona uno o mas miembros'
        },
        {
          key: 'galeriaProyecto',
          label: 'Galeria del proyecto',
          type: 'file',
          wide: true,
          multiple: true,
          accept: 'image/*,video/*'
        }
      ]
    },
    {
      key: 'galeria',
      label: 'Galeria',
      endpoint: `${API_BASE_URL}/galeria`,
      idKey: 'id',
      titleKey: 'titulo',
      canReorder: true,
      tableColumns: [
        { key: 'titulo', label: 'Titulo' },
        { key: 'tipo', label: 'Tipo' },
        { key: 'url', label: 'Archivo' }
      ],
      fields: [
        { key: 'titulo', label: 'Titulo', type: 'text', placeholder: 'Ej. Feria de proyectos' },
        {
          key: 'tipo',
          label: 'Tipo',
          type: 'select',
          required: true,
          options: [
            { label: 'Imagen', value: 'imagen' },
            { label: 'Video', value: 'video' }
          ]
        },
        {
          key: 'archivo',
          label: 'Archivo',
          type: 'file',
          required: true,
          wide: true,
          accept: 'image/*'
        }
      ]
    },
    {
      key: 'noticias',
      label: 'Noticias',
      endpoint: `${API_BASE_URL}/noticias`,
      idKey: 'id',
      titleKey: 'titulo',
      canReorder: true,
      tableColumns: [
        { key: 'titulo', label: 'Titulo' },
        { key: 'fecha', label: 'Fecha' },
        { key: 'contenido', label: 'Contenido' }
      ],
      fields: [
        { key: 'titulo', label: 'Titulo', type: 'text', required: true, placeholder: 'Ej. Convocatoria abierta' },
        { key: 'fecha', label: 'Fecha', type: 'date' },
        {
          key: 'contenido',
          label: 'Contenido',
          type: 'textarea',
          required: true,
          wide: true,
          placeholder: 'Escribe el contenido completo de la noticia.'
        }
      ]
    },
    {
      key: 'eventos',
      label: 'Eventos',
      endpoint: `${API_BASE_URL}/eventos`,
      idKey: 'id',
      titleKey: 'titulo',
      canReorder: true,
      tableColumns: [
        { key: 'titulo', label: 'Titulo' },
        { key: 'fecha', label: 'Fecha' },
        { key: 'hora', label: 'Hora' },
        { key: 'descripcion', label: 'Descripcion' }
      ],
      fields: [
        { key: 'titulo', label: 'Titulo', type: 'text', required: true, placeholder: 'Ej. Taller de desarrollo web' },
        { key: 'descripcion', label: 'Descripcion', type: 'textarea', required: true, wide: true, placeholder: 'Describe la actividad, publico objetivo y detalles relevantes.' },
        { key: 'fecha', label: 'Fecha', type: 'date', required: true },
        { key: 'hora', label: 'Hora', type: 'text', placeholder: 'Ej. 10:00 AM' }
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
  token = signal('');
  showPassword = signal(false);
  submitAttempted = signal(false);
  miembrosOptions = signal<{ label: string; value: string }[]>([]);
  loadingMiembrosOptions = signal(false);
  customOptions = signal<Record<string, string[]>>({});
  removedFiles = signal<Set<string>>(new Set());
  projectGalleryItems = signal<string[]>([]);
  draggedRecordId = signal<string | null>(null);
  dragOverRecordId = signal<string | null>(null);

  activeSection = computed(() => this.sections.find((section) => section.key === this.activeKey())!);
  isAuthenticated = computed(() => Boolean(this.token()));
  canReorderCurrentSection = computed(() => this.activeSection().canReorder !== false);

  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  dataForm = this.fb.group({});
  private selectedFiles: Record<string, File[]> = {};
  private formSubscriptions: Subscription[] = [];

  constructor() {
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe(() => this.clearNotices());

    if (this.isBrowser) {
      this.token.set(localStorage.getItem(TOKEN_KEY) || '');
      this.customOptions.set(this.loadCustomOptions());
    }

    if (this.isAuthenticated()) {
      this.loadSection();
    }
  }

  ngOnDestroy(): void {
    this.clearNoticeTimer();
    this.clearFormSubscriptions();
    this.routerSubscription.unsubscribe();
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.clearNotices();
    this.http.post<{ token: string }>(`${API_BASE_URL}/auth/login`, this.loginForm.getRawValue()).subscribe({
      next: ({ token }) => {
        if (this.isBrowser) {
          localStorage.setItem(TOKEN_KEY, token);
        }
        this.token.set(token);
        this.showSuccess('Sesion iniciada.');
        this.loadSection();
      },
      error: (error) => this.error.set(this.describeHttpError(error, 'No se pudo iniciar sesion.'))
    });
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(TOKEN_KEY);
    }
    this.token.set('');
    this.records.set([]);
    this.formVisible.set(false);
    this.clearNotices();
  }

  selectSection(key: SectionKey): void {
    this.clearNotices();
    this.activeKey.set(key);
    this.cancelForm();
    this.loadSection();
  }

  loadSection(): void {
    if (!this.canReorderCurrentSection()) {
      this.draggedRecordId.set(null);
      this.dragOverRecordId.set(null);
    }

    this.loading.set(true);
    this.error.set('');

    this.http.get<any[]>(this.activeSection().endpoint, { headers: this.authHeaders() }).subscribe({
      next: (records) => {
        this.records.set(Array.isArray(records) ? records : []);
        this.loading.set(false);
      },
      error: (error) => {
        this.error.set(this.describeHttpError(error, `No se pudieron cargar los registros de ${this.activeSection().label}.`));
        this.loading.set(false);
      }
    });
  }

  openCreateForm(): void {
    this.clearNotices();
    this.editingRecord.set(null);
    this.ensureMiembrosOptionsForCurrentSection();
    this.buildForm();
    this.formVisible.set(true);
    this.scrollToForm();
  }

  openEditForm(record: any): void {
    this.clearNotices();
    this.editingRecord.set(record);
    this.ensureMiembrosOptionsForCurrentSection();
    this.buildForm(record);
    this.formVisible.set(true);
    this.scrollToForm();
  }

  cancelForm(): void {
    this.formVisible.set(false);
    this.editingRecord.set(null);
    this.selectedFiles = {};
    this.removedFiles.set(new Set());
    this.projectGalleryItems.set([]);
    this.submitAttempted.set(false);
    this.clearFormSubscriptions();
    this.dataForm = this.fb.group({});
  }

  submitForm(): void {
    this.submitAttempted.set(true);
    this.error.set('');

    if (this.dataForm.invalid) {
      this.dataForm.markAllAsTouched();
      this.error.set(`Completa los campos obligatorios: ${this.invalidRequiredLabels().join(', ')}.`);
      return;
    }

    const record = this.editingRecord();
    const rawValue = this.dataForm.getRawValue();
    const pendingCustomOptions = this.extractCustomOptions(rawValue);
    const payload = this.buildPayload(rawValue);
    const request = record
      ? this.http.put(`${this.activeSection().endpoint}/${record[this.activeSection().idKey]}`, payload, {
          headers: this.authHeaders()
        })
      : this.http.post(this.activeSection().endpoint, payload, { headers: this.authHeaders() });

    request.subscribe({
      next: () => {
        this.saveCustomOptions(pendingCustomOptions);
        this.cancelForm();
        this.showSuccess(record ? 'Registro actualizado con exito.' : 'Registro creado con exito.');
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
          this.showSuccess('Registro eliminado con exito.');
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

  moveRecord(record: any, direction: -1 | 1): void {
    if (!this.canReorderCurrentSection()) {
      return;
    }

    const current = [...this.records()];
    const index = current.findIndex((item) => item[this.activeSection().idKey] === record[this.activeSection().idKey]);
    const nextIndex = index + direction;

    if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
      return;
    }

    [current[index], current[nextIndex]] = [current[nextIndex], current[index]];
    this.persistRecordOrder(current);
  }

  onRecordDragStart(event: DragEvent, record: any): void {
    const id = String(record?.[this.activeSection().idKey] || '');

    if (!id) {
      return;
    }

    this.draggedRecordId.set(id);
    event.dataTransfer?.setData('text/plain', id);
    event.dataTransfer?.setDragImage((event.currentTarget as HTMLElement), 18, 18);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onRecordDragOver(event: DragEvent, record: any): void {
    const draggedId = this.draggedRecordId();
    const targetId = String(record?.[this.activeSection().idKey] || '');

    if (!draggedId || !targetId || draggedId === targetId) {
      return;
    }

    event.preventDefault();
    this.dragOverRecordId.set(targetId);
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onRecordDrop(event: DragEvent, record: any): void {
    event.preventDefault();
    const draggedId = this.draggedRecordId() || event.dataTransfer?.getData('text/plain');
    const targetId = String(record?.[this.activeSection().idKey] || '');

    this.draggedRecordId.set(null);
    this.dragOverRecordId.set(null);

    if (!draggedId || !targetId || draggedId === targetId) {
      return;
    }

    const current = [...this.records()];
    const fromIndex = current.findIndex((item) => String(item[this.activeSection().idKey]) === draggedId);
    const toIndex = current.findIndex((item) => String(item[this.activeSection().idKey]) === targetId);

    if (fromIndex < 0 || toIndex < 0) {
      return;
    }

    const [moved] = current.splice(fromIndex, 1);
    current.splice(toIndex, 0, moved);
    this.persistRecordOrder(current);
  }

  onRecordDragEnd(): void {
    this.draggedRecordId.set(null);
    this.dragOverRecordId.set(null);
  }

  private persistRecordOrder(records: any[]): void {
    if (!this.canReorderCurrentSection()) {
      return;
    }

    this.records.set(records.map((item, orden) => ({ ...item, orden })));
    this.http
      .put(
        `${API_BASE_URL}/${this.activeKey()}/reordenar`,
        { ids: records.map((item) => item[this.activeSection().idKey]) },
        { headers: this.authHeaders() }
      )
      .subscribe({
        next: () => this.showSuccess('Orden actualizado.'),
        error: (error) => this.error.set(this.describeHttpError(error, 'No se pudo actualizar el orden.'))
      });
  }

  onFileChange(event: Event, field: AdminField): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    this.selectedFiles[field.key] = field.multiple ? files : files.slice(0, 1);
    if (this.selectedFiles[field.key].length) {
      this.updateRemovedFile(field.key, false);
    }
    this.dataForm.get(field.key)?.setValue(this.selectedFiles[field.key].length ? 'selected' : '');
    this.dataForm.get(field.key)?.markAsTouched();
  }

  optionsForField(field: AdminField): { label: string; value: string }[] {
    if (this.activeKey() === 'proyectos' && field.key === 'miembrosTexto') {
      const base = this.miembrosOptions();
      return [...base, { label: 'Otros', value: 'Otros' }];
    }

    const baseOptions = field.options || [];
    const customValues = this.customOptions()[this.customOptionKey(field)] || [];
    const customOptions = customValues.map((value) => ({ label: value, value }));
    const merged = [...baseOptions.filter((option) => option.value !== 'Otros'), ...customOptions];
    const seen = new Set<string>();
    const unique = merged.filter((option) => {
      if (!option.value || seen.has(option.value)) {
        return false;
      }
      seen.add(option.value);
      return true;
    });

    return baseOptions.some((option) => option.value === 'Otros')
      ? [...unique, { label: 'Otros', value: 'Otros' }]
      : unique;
  }

  shouldShowOtherInput(field: AdminField): boolean {
    const value = this.dataForm.get(field.key)?.value;
    return Boolean(
      field.otherKey &&
        (value === 'Otros' || (Array.isArray(value) && value.includes('Otros')))
    );
  }

  otherFieldError(field: AdminField): string {
    return field.otherKey ? this.fieldError(field.otherKey) : '';
  }

  isFieldVisible(field: AdminField): boolean {
    if (this.activeKey() === 'galeria' && field.key === 'archivo') {
      return Boolean(this.dataForm.get('tipo')?.value);
    }

    return true;
  }

  fileAcceptForField(field: AdminField): string | null {
    if (this.activeKey() === 'galeria' && field.key === 'archivo') {
      return this.dataForm.get('tipo')?.value === 'video' ? 'video/*' : 'image/*';
    }

    return field.accept || null;
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((visible) => !visible);
  }

  selectedFileNames(field: AdminField): string {
    return (this.selectedFiles[field.key] || []).map((file) => file.name).join(', ');
  }

  projectGalleryPreviewUrl(value: string): string {
    if (!value) {
      return '';
    }

    if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('assets/')) {
      return value;
    }

    return `assets/img/Proyectos/${encodeURIComponent(value)}`;
  }

  isVideoFile(value: string): boolean {
    return /\.(mp4|webm|ogg|mov)$/i.test(value);
  }

  removeProjectGalleryItem(index: number): void {
    this.projectGalleryItems.update((items) => items.filter((_, itemIndex) => itemIndex !== index));
    this.dataForm.get('galeriaProyecto')?.markAsTouched();
  }

  moveProjectGalleryItem(index: number, direction: -1 | 1): void {
    const items = [...this.projectGalleryItems()];
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= items.length) {
      return;
    }

    [items[index], items[nextIndex]] = [items[nextIndex], items[index]];
    this.projectGalleryItems.set(items);
    this.dataForm.get('galeriaProyecto')?.markAsTouched();
  }

  existingFileLabel(field: AdminField): string {
    const value = this.existingFileValue(field.key, this.editingRecord());
    return value ? String(value).split(/[\\/]/).pop() || value : '';
  }

  existingFileUrl(field: AdminField): string {
    const value = this.existingFileValue(field.key, this.editingRecord());

    if (!value || this.isExistingFileRemoved(field.key)) {
      return '';
    }

    const path = String(value);
    if (/^(https?:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('assets/')) {
      return path;
    }

    const folderBySection: Record<SectionKey, string> = {
      docentes: 'Docentes',
      egresados: 'Egresados',
      usuarios: '',
      proyectos: 'Proyectos',
      galeria: 'Galeria',
      noticias: '',
      eventos: ''
    };
    const folder = folderBySection[this.activeKey()];

    return folder ? `assets/img/${folder}/${encodeURIComponent(path)}` : '';
  }

  hasExistingFile(field: AdminField): boolean {
    return Boolean(this.existingFileValue(field.key, this.editingRecord()));
  }

  isExistingFileRemoved(key: string): boolean {
    return this.removedFiles().has(key);
  }

  removeExistingFile(field: AdminField): void {
    this.selectedFiles[field.key] = [];
    this.updateRemovedFile(field.key, true);
    this.dataForm.get(field.key)?.setValue('');
    this.dataForm.get(field.key)?.markAsTouched();
  }

  restoreExistingFile(field: AdminField): void {
    this.updateRemovedFile(field.key, false);
    this.dataForm.get(field.key)?.setValue('selected');
  }

  isPreviewableFile(field: AdminField): boolean {
    const value = this.existingFileValue(field.key, this.editingRecord()).toLowerCase();
    const accept = this.fileAcceptForField(field) || '';

    return accept.includes('image') || /\.(apng|avif|gif|jpe?g|png|webp|svg)$/i.test(value);
  }

  publicacionesPreviewLines(): string[] {
    const value = this.dataForm.get('publicacionesTexto')?.value;
    return this.parseLines(String(value || ''));
  }

  isLoginFieldInvalid(key: 'username' | 'password'): boolean {
    const control = this.loginForm.get(key);
    return Boolean(control?.invalid && control.touched);
  }

  isFieldInvalid(key: string): boolean {
    const control = this.dataForm.get(key);
    return Boolean(control?.invalid && (control.touched || this.submitAttempted()));
  }

  fieldError(key: string): string {
    const control = this.dataForm.get(key);

    if (!control || !this.isFieldInvalid(key)) {
      return '';
    }

    if (control.hasError('required')) {
      return 'Este campo es obligatorio.';
    }

    if (control.hasError('email')) {
      return 'Ingresa un correo valido, por ejemplo nombre@dominio.com.';
    }

    if (control.hasError('minlength')) {
      return 'Usa al menos 6 caracteres.';
    }

    return 'Revisa este campo.';
  }

  private buildForm(record?: any): void {
    this.clearFormSubscriptions();
    const controls: Record<string, any> = {};

    for (const field of this.activeSection().fields) {
      const hasExistingFile = field.type === 'file' && Boolean(this.existingFileValue(field.key, record));
      const validators = [];
      const isUsersPassword = this.activeKey() === 'usuarios' && field.key === 'password';
      const isOptionalUsersPassword = isUsersPassword && Boolean(record);

      const waitsForGalleryType = this.activeKey() === 'galeria' && field.key === 'archivo' && !record?.tipo;

      if (field.required && !hasExistingFile && !waitsForGalleryType && !isOptionalUsersPassword) {
        validators.push(Validators.required);
      }

      if (field.type === 'email') {
        validators.push(Validators.email);
      }

      if (isUsersPassword && !record) {
        validators.push(Validators.minLength(6));
      }

      const fieldValue = this.valueForField(field, record);

      controls[field.key] = [fieldValue, validators];

      if (field.otherKey) {
        controls[field.otherKey] = [
          this.valueForOtherField(field, fieldValue, record),
          this.valueIncludesOther(fieldValue) ? [Validators.required] : []
        ];
      }
    }

    this.dataForm = this.fb.group(controls);
    this.projectGalleryItems.set(this.existingProjectGallery(record));
    this.setupDynamicControlRules();
  }

  private valueForField(fieldOrKey: AdminField | string, record?: any): string | number | string[] {
    const key = typeof fieldOrKey === 'string' ? fieldOrKey : fieldOrKey.key;
    const field = typeof fieldOrKey === 'string'
      ? this.activeSection().fields.find((item) => item.key === key)
      : fieldOrKey;

    if (!record) {
      return field?.multiple ? [] : '';
    }

    if (key === 'publicacionesTexto') {
      return (record.publicaciones || [])
        .map((item: any) => `${item.titulo || ''} | ${item.anio || ''} | ${item.enlace || ''}`)
        .join('\n');
    }

    if (field?.multiple && key === 'miembrosTexto') {
      return (record.miembros || []).map((item: any) => item.nombre || item);
    }

    if (key === 'fecha' && record.fecha) {
      return String(record.fecha).slice(0, 10);
    }

    if (this.activeKey() === 'usuarios' && key === 'password') {
      return '';
    }

    if (field?.type === 'file') {
      return this.existingFileValue(key, record) ? 'selected' : '';
    }

    if (field?.otherKey && record[key]) {
      return this.optionsForField(field).some((option) => option.value === record[key]) ? record[key] : 'Otros';
    }

    return record[key] ?? '';
  }

  private valueForOtherField(field: AdminField, fieldValue: string | number | string[], record?: any): string {
    const value = record?.[field.key];

    if (!record || fieldValue !== 'Otros' || value === undefined || value === null) {
      return '';
    }

    return String(value);
  }

  private buildPayload(rawValue: any): any {
    const payload = { ...rawValue };

    for (const field of this.activeSection().fields) {
      if (field.type === 'file') {
        delete payload[field.key];
        if (this.removedFiles().has(field.key)) {
          payload[field.key] = '';
        }
      }
    }

    if (this.activeKey() === 'usuarios') {
      if (!payload.password) {
        delete payload.password;
      }
    }

    if ('anio' in payload && payload.anio !== '') {
      payload.anio = Number(payload.anio);
    } else if ('ano' in payload && payload.ano !== '') {
      payload.anio = Number(payload.ano);
      delete payload.ano;
    }

    if ('publicacionesTexto' in payload) {
      payload.publicaciones = this.parsePublicaciones(payload.publicacionesTexto);
      delete payload.publicacionesTexto;
    }

    for (const field of this.activeSection().fields) {
      if (field.otherKey) {
        const otherValue = String(payload[field.otherKey] || '').trim();
        if (Array.isArray(payload[field.key])) {
          payload[field.key] = payload[field.key].filter((value: string) => value !== 'Otros');
          if (otherValue) {
            payload[field.key] = [...payload[field.key], otherValue];
          }
        } else if (payload[field.key] === 'Otros' && otherValue) {
          payload[field.key] = otherValue;
        }
        delete payload[field.otherKey];
      }
    }

    if ('miembrosTexto' in payload) {
      const miembros = Array.isArray(payload.miembrosTexto)
        ? payload.miembrosTexto
        : this.parseLines(payload.miembrosTexto);
      payload.miembros = miembros.map((nombre: string) => ({ nombre }));
      delete payload.miembrosTexto;
    }

    if (this.activeKey() === 'proyectos') {
      payload.galeriaProyecto = this.projectGalleryItems();
    }

    for (const key of Object.keys(payload)) {
      if (payload[key] === '' && !this.removedFiles().has(key)) {
        payload[key] = undefined;
      }
    }

    if (!this.usesMultipart()) {
      return payload;
    }

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }

      formData.append(key, Array.isArray(value) || typeof value === 'object'
        ? JSON.stringify(value)
        : String(value)
      );
    });

    for (const [key, files] of Object.entries(this.selectedFiles)) {
      files.forEach((file) => formData.append(key, file));
    }

    return formData;
  }

  private setupDynamicControlRules(): void {
    for (const field of this.activeSection().fields) {
      if (field.otherKey) {
        const control = this.dataForm.get(field.key);
        const otherControl = this.dataForm.get(field.otherKey);
        const subscription = control?.valueChanges.subscribe((value) => {
          if (this.valueIncludesOther(value)) {
            otherControl?.setValidators([Validators.required]);
          } else {
            otherControl?.clearValidators();
            otherControl?.setValue('');
          }
          otherControl?.updateValueAndValidity();
        });

        if (subscription) {
          this.formSubscriptions.push(subscription);
        }
      }

      if (this.activeKey() === 'galeria' && field.key === 'tipo') {
        const archivoControl = this.dataForm.get('archivo') as AbstractControl | null;
        const updateArchivoRequirement = (tipo: unknown) => {
          if (tipo) {
            archivoControl?.setValidators([Validators.required]);
          } else {
            archivoControl?.clearValidators();
          }
          archivoControl?.updateValueAndValidity();
        };

        updateArchivoRequirement(this.dataForm.get('tipo')?.value);

        const subscription = this.dataForm.get('tipo')?.valueChanges.subscribe((tipo) => {
          this.selectedFiles['archivo'] = [];
          archivoControl?.setValue('');
          archivoControl?.markAsUntouched();
          updateArchivoRequirement(tipo);
        });

        if (subscription) {
          this.formSubscriptions.push(subscription);
        }
      }
    }
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

  private existingFileValue(key: string, record?: any): string {
    if (!record) {
      return '';
    }

    if (key === 'galeriaProyecto') {
      return '';
    }

    if (key === 'archivo') {
      return record.url || '';
    }

    return record[key] || '';
  }

  private existingProjectGallery(record?: any): string[] {
    if (!record || this.activeKey() !== 'proyectos') {
      return [];
    }

    if (Array.isArray(record.galeriaProyecto)) {
      return record.galeriaProyecto.filter(Boolean);
    }

    if (Array.isArray(record.galeria)) {
      return record.galeria.map((item: any) => (typeof item === 'string' ? item : item.url)).filter(Boolean);
    }

    return [];
  }

  private customOptionKey(field: AdminField): string {
    return `${this.activeKey()}:${field.key}`;
  }

  private loadCustomOptions(): Record<string, string[]> {
    try {
      const parsed = JSON.parse(localStorage.getItem(CUSTOM_OPTIONS_KEY) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  private extractCustomOptions(rawValue: any): { key: string; value: string }[] {
    return this.activeSection().fields
      .filter((field) => field.otherKey && this.valueIncludesOther(rawValue[field.key]))
      .map((field) => ({
        key: this.customOptionKey(field),
        value: String(rawValue[field.otherKey!] || '').trim()
      }))
      .filter((item) => item.value);
  }

  private saveCustomOptions(options: { key: string; value: string }[]): void {
    if (!this.isBrowser || !options.length) {
      return;
    }

    const next = { ...this.customOptions() };

    for (const option of options) {
      const current = next[option.key] || [];
      if (!current.some((value) => value.toLowerCase() === option.value.toLowerCase())) {
        next[option.key] = [...current, option.value].sort((a, b) => a.localeCompare(b));
      }
    }

    this.customOptions.set(next);
    localStorage.setItem(CUSTOM_OPTIONS_KEY, JSON.stringify(next));
  }

  private updateRemovedFile(key: string, removed: boolean): void {
    const next = new Set(this.removedFiles());
    if (removed) {
      next.add(key);
    } else {
      next.delete(key);
    }
    this.removedFiles.set(next);
  }

  private authHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token()}`
    });
  }

  private usesMultipart(): boolean {
    return this.activeSection().fields.some((field) => field.type === 'file');
  }

  private valueIncludesOther(value: unknown): boolean {
    return value === 'Otros' || (Array.isArray(value) && value.includes('Otros'));
  }

  private ensureMiembrosOptionsForCurrentSection(): void {
    if (this.activeKey() !== 'proyectos' || this.miembrosOptions().length || this.loadingMiembrosOptions()) {
      return;
    }

    this.loadingMiembrosOptions.set(true);
    this.http.get<any[]>(`${API_BASE_URL}/miembros-proyecto`, { headers: this.authHeaders() }).subscribe({
      next: (miembros) => {
        this.miembrosOptions.set((Array.isArray(miembros) ? miembros : []).map((miembro) => {
          const fullName = String(miembro.nombre || '').trim();
          return {
            label: fullName || 'Miembro sin nombre',
            value: fullName
          };
        }).filter((option) => option.value));
        this.loadingMiembrosOptions.set(false);
      },
      error: () => {
        this.loadingMiembrosOptions.set(false);
        this.error.set('No se pudo cargar la lista de miembros de proyecto.');
      }
    });
  }

  private clearFormSubscriptions(): void {
    this.formSubscriptions.forEach((subscription) => subscription.unsubscribe());
    this.formSubscriptions = [];
  }

  private invalidRequiredLabels(): string[] {
    const labels: string[] = [];

    for (const field of this.activeSection().fields) {
      if (field.required && this.isFieldVisible(field) && this.dataForm.get(field.key)?.invalid) {
        labels.push(field.label);
      }

      if (field.otherKey && this.dataForm.get(field.otherKey)?.invalid) {
        labels.push(`${field.label} personalizada`);
      }
    }

    return labels;
  }

  private scrollToForm(): void {
    if (!this.isBrowser) {
      return;
    }

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  private showSuccess(message: string): void {
    this.error.set('');
    this.message.set(message);
    this.clearNoticeTimer();
    this.noticeTimeout = setTimeout(() => this.message.set(''), 3500);
  }

  private clearNotices(): void {
    this.message.set('');
    this.error.set('');
    this.clearNoticeTimer();
  }

  private clearNoticeTimer(): void {
    if (this.noticeTimeout) {
      clearTimeout(this.noticeTimeout);
      this.noticeTimeout = null;
    }
  }

  private describeHttpError(error: HttpErrorResponse, fallback: string): string {
    const backendMessage = error.error?.error || error.message;

    if (error.status === 401) {
      return backendMessage
        ? `${fallback} ${backendMessage}`
        : `${fallback} La sesion expiro o el token no es valido. Cierra sesion y vuelve a entrar.`;
    }

    return backendMessage ? `${fallback} ${backendMessage}` : `${fallback} Verifica los datos.`;
  }
}
