import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

interface HeroInfo {
  titulo: string;
  subtitulo: string;
  descripcion: string;
}

interface InfoInstitucional {
  texto: string;
}

interface Stat {
  numero: string;
  texto: string;
}

//* Recorrido virtual*//
interface TourStep {
  img: string;
  controls: {
    label: string;
    target: number;
  }[];
}


@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'quienes-somos-page',
  templateUrl: './quienessomos-page.component.html',
  styleUrls: ['./quienessomos-page.component.css']
})
export class QuienesSomosPageComponent {

  // HERO
  public hero = signal<HeroInfo>({
    titulo: '¿Quiénes Somos?',
    subtitulo: 'Formamos líderes en el área de software y hardware',
    descripcion: `Profesionales capaces de diseñar, desarrollar e implementar soluciones tecnológicas
    innovadoras, gestionando proyectos de sistemas de información y participando en
    equipos multidisciplinarios. Cuentan con habilidades en programación, bases de datos,
    redes, desarrollo de software y aplicación de tecnologías emergentes para resolver
    problemáticas reales en organizaciones y en la sociedad.`
  });

  // MISIÓN Y VISIÓN (los dos párrafos)
  public infoInstitucional = signal<InfoInstitucional[]>([
    {
      texto: 'Formar profesionales líderes en el diseño, desarrollo y aplicación de sistemas inteligentes y de software, para satisfacer las necesidades en los sectores público y privado a nivel nacional e internacional, impulsando el desarrollo social mediante una educación integral y multidisciplinaria.'
    },
    {
      texto: 'Consolidarse como una carrera líder en la formación de profesionistas analíticos, con conocimientos sólidos en informática para el desarrollo de sistemas inteligentes y software, que aporten soluciones tecnológicas e innovadoras con reconocimiento nacional e internacional, que contribuyan a mejorar el entorno global e impacten positivamente en el desarrollo de la sociedad.'
    }
  ]);

  // VALORES
  public valores = signal<string[]>([
    'Disciplina y Respeto',
    'Responsabilidad y Tolerancia',
    'Lealtad y Honradez',
    'Honestidad y Solidaridad Social',
    'Excelencia académica',
    'Compromiso social',
    'Innovación y tecnología',
    'Desarrollo sostenible'
  ]);

  // INDICADORES
  public stats = signal<Stat[]>([
    { numero: '23+', texto: 'Años de experiencia' },
    { numero: '863+', texto: 'Estudiantes activos' },
    { numero: '228+', texto: 'Docentes calificados' },
    { numero: '90%', texto: 'Tasa de empleabilidad' }
  ]);

  // CTA
  public cta = signal({
    titulo: 'Conoce el plan de estudios de nuestra carrera',
    descripcion: `Descubre nuestra oferta educativa en el área de tecnologías de la información, donde podrás
    formarte como profesional en Informática o como Ingeniero/a en Desarrollo de Software y Sistemas Inteligentes.
    Ambas carreras están diseñadas para brindarte competencias sólidas en programación, administración de sistemas,
    bases de datos, desarrollo web y móvil, así como el diseño e implementación de soluciones tecnológicas innovadoras
    que responden a las necesidades actuales de la industria y la sociedad.`
  });


//* Recorrido virtual*//

  /* ================= RECORRIDO VIRTUAL ================= */

currentStep = signal<number>(0);

tour = signal<TourStep[]>([
  {
    img: 'assets/img/recorrido/1.ImagenUnistmo.JPG',
    controls: [
      { label: '▶ Iniciar recorrido', target: 1 }
    ]
  },
  {
    img: 'assets/img/recorrido/2.Pasillo_principal.jpeg',
    controls: [
      { label: '⬅ Electrónica', target: 2 },
      { label: '➡ Edificio', target: 7 }
    ]
  },
  {
    img: 'assets/img/recorrido/3.Pasillo_Electronica1.jpeg',
    controls: [
      { label: '⬇ Atrás', target: 1 },
      { label: '⬆ Adelante', target: 3 }
    ]
  },
  {
    img: 'assets/img/recorrido/4.Pasillo_Electronica2.jpeg',
    controls: [
      { label: '⬇ Atrás', target: 2 },
      { label: '⬆ Adelante', target: 4 }
    ]
  },
  {
    img: 'assets/img/recorrido/5.Sala_Electronica.jpeg',
    controls: [
      { label: '⬇ Atrás', target: 3 },
      { label: '⬆ Adelante', target: 5 }
    ]
  },
  {
    img: 'assets/img/recorrido/6.Int_Electronica1.jpeg',
    controls: [
      { label: '⬇ Atrás', target: 4 },
      { label: '⬆ Adelante', target: 6 }
    ]
  },
  {
    img: 'assets/img/recorrido/7.Int_Electronica2.jpeg',
    controls: [
      { label: '⬇ Regresar', target: 4 }
    ]
  },
  {
    img: 'assets/img/recorrido/8.Pasillo_Edificio1.jpeg',
    controls: [
      { label: '⬇ Atrás', target: 1 },
      { label: '⬆ Adelante', target: 8 }
    ]
  },
  {
    img: 'assets/img/recorrido/9.Pasillo_Edificio2.jpeg',
    controls: [
      { label: '⬇ Atrás', target: 7 },
      { label: '⬆ Adelante', target: 9 }
    ]
  },
  {
    img: 'assets/img/recorrido/10.Sala_Computo3.jpeg',
    controls: [
      { label: '⬇ Atrás', target: 8 },
      { label: '➡ Entrar', target: 10 },
      { label: '⬆ Adelante', target: 12 }
    ]
  },
  {
    img: 'assets/img/recorrido/11.Int_Computo1.jpeg',
    controls: [
      { label: '⬇ Atrás', target: 9 },
      { label: '⬆ Adelante', target: 11 }
    ]
  },
  {
    img: 'assets/img/recorrido/12.Int_Computo2.jpeg',
    controls: [
      { label: '⬇ Regresar', target: 9 }
    ]
  },
  {
    img: 'assets/img/recorrido/13.Escaleras1.jpeg',
    controls: [
      { label: '⬇ Atrás', target: 9 },
      { label: '⬆ Adelante', target: 13 }
    ]
  },
  {
    img: 'assets/img/recorrido/14.Escaleras2.jpeg',
    controls: [
      { label: '⬇ Atrás', target: 12 },
      { label: '⬆ Adelante', target: 14 }
    ]
  },
  {
    img: 'assets/img/recorrido/15.Sala_Redes.jpeg',
    controls: [
      { label: '⬇ Atrás', target: 13 },
      { label: '⬅ Entrar', target: 15 },
      { label: '⬆ Adelante', target: 17 }
    ]
  },
  {
    img: 'assets/img/recorrido/16.Int_Redes1.jpeg',
    controls: [
      { label: '⬅ Atrás', target: 14 },
      { label: '⬆ Adelante', target: 16 }
    ]
  },
  {
    img: 'assets/img/recorrido/17.Int_Redes2.jpeg',
    controls: [
      { label: '⬇ Regresar', target: 14 }
    ]
  },
  {
    img: 'assets/img/recorrido/18.PasilloSuperior.jpeg',
    controls: [
      { label: '⬇ Atrás', target: 14 },
      { label: '⬆ Adelante', target: 18 }
    ]
  },
  {
    img: 'assets/img/recorrido/19.Sala_Desarrollo.jpeg',
    controls: [
      { label: '⬇ Atrás', target: 17 },
      { label: '⬆ Adelante', target: 19 }
    ]
  },
  {
    img: 'assets/img/recorrido/20.Int_Desarrollo1.jpeg',
    controls: [
      { label: '⬇ Atrás', target: 18 },
      { label: '⬆ Adelante', target: 20 }
    ]
  },
  {
    img: 'assets/img/recorrido/21.Int_Desarrollo2.jpeg',
    controls: [
      { label: '⬇ Regresar', target: 19 }
    ]
  }
]);

goTo(step: number) {
  if (step >= 0 && step < this.tour().length) {
    this.currentStep.set(step);
  }
}
}
