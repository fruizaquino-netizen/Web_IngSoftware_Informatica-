
import { Component, signal } from '@angular/core';

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

@Component({
  selector: 'docentes',
  templateUrl: './docentes-pages.component.html',
  styleUrls: ['./docentes-pages.component.css']
})

export class DocentesPageComponent {

  public docenteSeleccionado = signal<Docente | null>(null);
  // Signal con la lista completa de docentes y sus trayectorias
  public docentes = signal<Docente[]>([
    {
      nombre: 'Lic. Gerardo Rafael Alfaro Cruz',
      especialidad: 'Licenciatura en humanidades - UAM',
      cargo: ' Profesor de tiempo completo de la Universidad del Istmo, Campus Ixtepec.',
      imagen: 'assets/docente1.png',
      descripcion: 'Listar las líneas de investigación actualizadas.',
      email: 'correo@unistmo.edu.mx',
      publicaciones: [
        { titulo: 'Regiduría de Cultura de Juchitán. (2011) Bicunisa. Num. 1, Dossier fotográfico. Coordinación de la sección de fotografía a cargo de Alfaro Cruz, Gerardo.', anio: 2011, enlace: 'https://scholar.google.com' },
        { titulo: 'CONACULTA. (2010). Ofrendas o altares de día de muertos de México. Fotografía de altares de muertos en Oaxaca. Fotografías de Alfaro Cruz, Gerardo. ', anio: 2010, enlace: '#' },
        { titulo: 'Revista pedagógica y literaria de la ENUFI. (2009). Bacuzagui. Publicación trimestral, Núm. 1. Fotografías de Alfaro Cruz, Gerardo. ', anio: 2009, enlace: '#' },
        { titulo: 'Pastrana, Soid. Palmeras y rosas. (2011). Museo Universitario de Puebla. Fotografía completa en la obra a cargo de Alfaro Cruz, Gerardo. ', anio: 2011, enlace: '#' },
        { titulo: 'l’Associació arqueológica de la Vall d’Uixó. (2008). Orleyl num. 5. Fotografía de Alfaro Cruz, Gerardo. ', anio: 2008, enlace: '#' }
      ]
    },
    {
      nombre: 'Dr. en C. Felipe Benítez Domínguez',
      especialidad: 'Participación en la sesión de poster del 3er Congreso Internacional en Energías Renovables 2019. 13 al 15 de noviembre de 2019, Universidad del Mar. Huatulco, Oaxaca.',
      cargo: 'Profesor-Investigador en la Universidad del Istmo, Campus Cd. Ixtepec, Oax. Septiembre de 2006 – actual',
      imagen: 'assets/docente2.png',
      descripcion: 'Especialista en arquitectura de software y metodologías ágiles. Lidera proyectos de transformación digital corporativa.',
      email: 'fbenitez@bianni.unistmo.edu.mx',
      publicaciones: [
        { titulo: 'Huerta Luis, Ruiz Juan, Cabrera Nubia, Montiel Luis, Benítez Felipe, Ramírez Víctor, Data Mining: Impact of Daily Activities on Student Performance", International Journal of Innovation and Applied Studies, Vol. 14, Issue 4, (2016), 927-935. ', anio: 2016, enlace: '#' },
        { titulo: 'Huerta Luis, Santiago Pablo, Ruiz Juan, Cabrera Nubia, Oscar de la Rosa, Benítez Felipe, "A Virtual Learning Environment for Elementary Algebra Based on Games and the Principles of Cognitive Theory", International Journal of Innovation and Applied Studies, Vol. 12, Issue 1, (2015), 243-251', anio: 2015, enlace: '#' },
        { titulo: 'F. Benítez, “Solución de ecuaciones no lineales mediante métodos asintóticos”, Revista de Ciencia e Ingeniería del Instituto Tecnológico Superior de Coatzacoalcos, Coatzacoalcos, Ver., Año 2, No. 2 (Enero-Diciembre 2015), 284-289. ISSN: 2395-907X. ', anio: 2015, enlace: '#' },
        { titulo: 'F. Benítez, E. I. Kaikina, "Whitham equation with Landau damping on a half-line", Journal of Mathematical Analysis and Applications, Vol. 387, Issue 1, (2012), 359-373.', anio: 2012, enlace: '#' },
        { titulo: 'F. Benítez, E. I. Kaikina, "Dirichlet problem for intermediate long-wave equation", Differential and Integral Equations, Vol. 24, No. 11-12, (2011), 1163-1192.', anio: 2011, enlace: '#' },
        { titulo: 'F. Benítez, E. I. Kaikina, "A Neumann problem for the KdV equation with Landau damping on a half-line", Nonlinear Analysis: Theory, Methods & Applications, Vol.74, Issue 14, (October 2011), 4682-4697.', anio: 2011, enlace: '#' },
        { titulo: 'F. Benítez, I. Sánchez, J. A. Huesca, “Ecuación de transmisión de Calor”, Revista de Temas de Ciencia y Tecnología de la UTM, Huajuapan de León, Oax., Vol. 13, No. 39 (Septiembre-Diciembre 2009), 13-18. ISSN: 2007-0977.', anio: 2009, enlace: '#' },
        { titulo: 'F. Benítez, E. I. Kaikina, H. F. Ruiz, "Subcritical nonlinear dissipative equations on a half-line", Arabian Journal for Science and Engineering, Section A: Science, Vol. 34, No. 1A (2009), 179-207.', anio: 2009, enlace: '#' },
        { titulo: 'MF. Benítez, R. E. Cardiel, E. I. Kaikina, "Neumann problem for the nonlinearfractional heat equation with large initial data", Pacific Journal of Applied Mathematics, Vol. 1, No. 1 (2008), 67-88.', anio: 2008, enlace: '#' },
        { titulo: 'F. Benítez, J. L. Guardado, E. I. Kaikina, H. F. Ruiz, “An Asymptotic Solution to Non-linear Transmission Lines”, Journal of Nonlinear Analysis Series B: Real World Applications, Vol. 8, No. 3 (2007), 715-724.', anio: 2007, enlace: '#' },
        { titulo: 'F. Benítez, E. I. Kaikina, "Critical nonlinear dissipative equations on a half-line", Nonlinear Phenomena in Complex Systems, Vol. 9, No. 4 (2006), 331-351.', anio: 2006, enlace: '#' },
        { titulo: 'F. Benítez, E. I. Kaikina, "Kuramoto-Sivashinsky type equations on a half-line", SUT Journal of Mathematics, Vol. 41, No. 2 (2005), 153-178.', anio: 2005, enlace: '#' }
      ]
    },
    {
      nombre: 'Dr. Luis David Huerta Hernández',
      especialidad: 'Dr. En Sistemas Computacionales',
      cargo: 'Profesor Investigador Asociado C, Jefe de carrera de la Licenciatura en Informática, Comité del servicio de la cafetería UNISTMO y Vocal en el comité de adquisiciones de la UNISTMO',
      imagen: 'assets/img/Luis.png',
      descripcion: 'Reconocimiento de Patrones.',
      email: 'ldhuerth@gmail.com, luisdh2@bianni.unistmo.edu.mx',
      publicaciones: [
        { titulo: 'New Method for Automatic Recognition of Mexican Indigenous Languages: Comparative Performance of Classifiers, Springer Nature 2023.', anio: 2023, enlace: 'https://doi.org/10.1007/s42979-023-01985-' },
        { titulo: 'Selección de características de microarreglos de ADN utilizando una búsqueda Cuckoo.', anio: 2019, enlace: 'https://doi.org/10.30973/progmat/2019.11.3/2' },
        { titulo: 'Exploration of DNA Microarrays Using Data Mining and a Taboo Search', anio: 2018, enlace: '#' },
        { titulo: 'Evaluating the Communicability of a Video Game Prototype: A Simple and Low-Cost Method', anio: 2014, enlace: '#'}
      ]
    },
    {
      nombre: 'M. en I. Carlos Edgardo Cruz Pérez',
      especialidad: 'Maestría en Ingeniería en Tecnología de la Información',
      cargo: 'Profesor Investigador de Tiempo Completo de la Licenciatura en Informática y de la Ingeniería en Desarrollo de Software y Sistemas Inteligentes',
      imagen: 'assets/img/Carlos.png',
      descripcion: 'Ciberseguridad Avanzada.',
      email: 'carloscruz@bianni.unistmo.edu.mx',
      publicaciones: [
        { titulo: 'Hernández Montiel, L. Velázquez Vázquez, J. & Cruz Pérez, C. (2021). Reducción y clasificación de una base de datos de audio mediante redes neuronales artificiales y minería de datos para el diagnóstico de pacientes con enfermedad De Parkinson . Research in Computing Science Vol 150 No 5, pp. 141–154. ', anio: 2021, enlace: '#' },
        { titulo: 'Hernández Montiel, L. Cruz Pérez, C. & Hernández, L. (2019). Selección de Características de Microarreglos de ADN Utilizando una Búsqueda Cuckoo. Programación Matemática y Software Volumen (11), pp. 12–31. ', anio: 2019, enlace: '#' },
        { titulo: 'Hernández Montiel, L. Cruz Pérez, C. & Ruiz Ruiz J. (2017). Selección y clasificación de genes cancerígenos utilizando un método híbrido filtro/wrapper. Advances in Social Informatics and its Applications Volumen (136), pp. 85–97. ', anio: 2017, enlace: '#' }
      ]
    },
    {
      nombre: 'M. en I.A. Nayeli Joaquinita Meléndez Acosta',
      especialidad: 'Maestría en Inteligencia Artificial. Facultad de Física e Inteligencia Artificial, Universidad Veracruzana, México.',
      cargo: 'Profesor-Investigador de tiempo completo en la Universidad de Istmo, campus Ixtepec, adscrito a la Licenciatura en Informática',
      imagen: 'assets/img/Nayeli.jpg',
      descripcion: 'Inteligencia Artificial: Aprendizaje Automático, ciencia de datos, reconocimiento de patrones, algoritmos bio-inspirados, visión por computadora, procesamiento de imágenes y redes neuronales.',
      email: 'nayelim@bianni.unistmo.edu.mx',
      publicaciones: [
        { titulo: 'Meléndez Acosta, N. J., Bonilla Huerta E., Ramírez Cruz, J.F. & González Meneses Y. N. (2024). Fomentando la lectura y la imaginación en cuentos infantiles con Inteligencia Artificial Generativa. Komputer Sapiens. Vol. 2, N. 16.', anio: 2024, enlace: '#' },
        { titulo: 'Meléndez Acosta, N. J., Bonilla Huerta E., Ramírez Cruz, J.F. & González Meneses Y. N. (2024). Generation of realistic childrens book images based on Diffusion Models. Ingeniare. Rev. chil. ing., vol.32, 12. ISSN 0718-3305. ', anio: 2024, enlace: 'http://dx.doi.org/10.4067/s0718-33052024000100212' },
        { titulo: 'Meléndez Acosta, N. J.,Bonilla Huerta E., Ramírez Cruz, J.F. & González Meneses Y N. (2023). Generador de ilustraciones para libros utilizando inteligencia artificial. Reseach in Computing Science, 152(9), 51-65.', anio: 2023, enlace: '#' },
        { titulo: 'Meléndez Acosta, N. J., Espinoza Solís D.M., & León Borges J. A. (2022). Expert fuzzy system determining dengue, zika, chikungunya and yellow fever infection. Computación y Sistemas, Vol. 26, No.1.', anio: 2022, enlace: '#' },
        { titulo: 'Meléndez Acosta, N. J. (2020). Recocido Simulado y el Algoritmo de Selección Clonal aplicados al Problema del Vendedor Viajero. Research in Computing Science, 149, 1211-1226', anio: 2020, enlace: '#' },
        { titulo: 'Antonio Vázquez, A., Hernández Montiel, L., & Meléndez Acosta, N. J. (2020). Segmentación de Imágenes Oftalmológicas a Color utilizando Conjuntos Difusos. Programación Matemática y Software, 12, 23-38.', anio: 2020, enlace: '#' },
        { titulo: 'Meléndez Acosta, N. J., Vásquez Martínez, P., & Solano Monje, R. (2019). Software de enseñanza-aprendizaje de la lectoescritura del idioma español. Investigación en Tecnologías de la Información, 7, 164-179. ', anio: 2019, enlace: 'https://doi.org/10.36825/RITI.07.14.014' },
        { titulo: 'Meléndez Acosta, N. J., Solano Monje, R., García García, C., & Ríos Figueroa, H. (2019). Ca-PSO Coulomb atrayendo un Cúmulo de Partículas. Programación Matemática y Software, 11, 1-11', anio: 2019, enlace: '#' },
        { titulo: 'Solano Monje, R., Meléndez Acosta, N. J., García García, C., & Ríos Figueroa, H. V. (2018). C-PSO: Optimización por cúmulo de partículas incrustando la ley de Coulomb. Reseach in Computing Science, 147, 311-322.', anio: 2018, enlace: 'https://doi.org/10.13053/rcs-136-1-3' },
        { titulo: 'García García, C., & Meléndez Acosta, N. J. (2017). Clasificación de género utilizando medidas antropométricas, análisis de texturas y la arquitectura ANFIS. Research in Computing Science, 136, 33-46. ', anio: 2017, enlace: 'https://doi.org/10.13053/rcs-136-1-3' },
        { titulo: 'Solano Monje, R., Meléndez Acosta, N. J., & Ríos Figueroa, H. V. (2017). STUTTY: Aplicación Móvil para mermar la Tartamudez utilizando la Técnica del Tartamudeo- Sencillo. Research in Computing Science, 136, 21-32.', anio: 2017, enlace: '#' },
        { titulo: 'Meléndez Acosta, N. J., Solano Monje, R., Ruíz Ruíz, J. G., & Ríos Figueroa, H. V. (2016). Determinación del Lado Bello del Rostro Usando Eigenespacios de Belleza Paramétricos. Programación Matemática y Software (8), 1-7.', anio: 2016, enlace: '#' },
        { titulo: 'Solano Monje, R., Meléndez Acosta, N. J., & Ríos Figueroa, H. V. (2016). Embellecimiento facial evolutivo dirigido por fuerzas. Research in Computing Science, 114, 9-21.', anio: 2016, enlace: 'https://doi.org/10.13053/rcs-114-1-1' },
        { titulo: 'Solano Monje, R., Meléndez Acosta, N. J., Juárez Vázquez, S., & Ríos Figueroa, H. V. (2015). Eigenespacios de Belleza Paramétricos como Máquina Calificadora. Research in Computing Science, 93, 133-140.', anio: 2015, enlace: '#' },
        { titulo: 'Solano Monje, R., Meléndez Acosta, N. J., Juárez Vázquez, S., & Ríos Figueroa, H. V. (2015). Belleza Artificial: Evolucionando Partes del Rostro. Reseach in Computing Science, 93, 121-132.', anio: 2015, enlace: 'https://doi.org/10.13053/rcs-93-1-10' },
        { titulo: 'Meléndez Acosta, N. J., Ríos Figueroa, H. V., & Marín Hernández, A. (2013). Dos métricas para evaluar el sistema CBIR-Esporas. Reseach in Computing Science, 64, 113-120', anio: 2013, enlace: '#' },
        { titulo: 'Meléndez Acosta, N. J., Ríos Figueroa, H. V., & Marín Hernández, A. (2013). Recuperación de Imágenes en Base a Contenido: Una Aplicación con Esporas. Research in Computing Science(62), 156-164.niciando con el más actual', anio: 2013, enlace: '#' }

      ]
    },
    {
      nombre: ' Dr. Francisco Alejandro González Horta',
      especialidad: 'Postdoctorado en Computación, 2013-2014. Departamento de Computación, CINVESTAV-IPN, Zacatenco, Ciudad de México, México, CP 07360.',
      cargo: 'Profesor Investigador Titular “A” (2015-presente). Licenciatura en Informática, Ingeniería en Desarrollo de Software y Sistemas Inteligentes. UNISTMO Campus Ixtepec. Ciudad Ixtepec, Oaxaca, México, CP 70110.',
      imagen: 'assets/docente6.png',
      descripcion: 'Gestión de la movilidad en redes inalámbricas heterogéneas sobrepuestas.',
      email: 'fglez@bianni.unistmo.edu.mx',
      publicaciones: [
        { titulo: 'F.A. González-Horta, P. Mejía-Álvarez, E. Buenfil-Alpuche (2015). Multipurpose mobility services for the future Internet. Computer Networks: The International Journal of Computer and Telecommunications Networking, 93(P1), 23-40, Elsevier. ISSN: 1389-1286.', anio: 2015, enlace: 'https://doi.org/10.1016/j.comnet.2015.09.033' },
        { titulo: 'V. Chi, L. Narváez, F.A. Gonzalez-Horta, M. Canché (2013). Description of a Heterogeneous Handoff Algorithm. IJCSI International Journal of Computer Science Issues, 10-6(1), 302-308. ISSN (Online): 1694-0784. ISSN (Print): 1694-0814.', anio: 2013, enlace: '#' },
        { titulo: 'F.A. González-Horta, R. Enríquez, J. Ramírez, J. Carballido, E. Buenfil (2011). A Cognitive Handoff: Holistic Vision, Reference Framework, Model-Driven Methodology, and Taxonomy of Scenarios. International Journal on Advances in Networks and Services, 4(3&4), 324-342. ISSN: 1942-2644.', anio: 2011, enlace: '#' },
        { titulo: 'V. Chi, F.A. Gonzalez-Horta, L. Narváez (2007). Simulator for Behavior Modeling of Mobile Nodes between Heterogeneous Networks. IJCSNS International Journal of Computer Science and Network Security, 7(12), 222-227. ISSN: 1738-7906.', anio: 2007, enlace: '#' }
      ]
    },
    {
      nombre: 'M. en C. Cosijopii García García',
      especialidad: 'Maestría en ciencias en el área de ciencias computacionales',
      cargo: 'Profesor Asociado B asignado a la licenciatura en Informática Universidad del Istmo Campus Ixtepec. [Oct 2024 - Presente]',
      imagen: 'assets/img/Cosijopi.jpg',
      descripcion: 'Optimización Multiobjetivo.',
      email: 'cosijopii@bianni.unistmo.edu.mx',
      publicaciones: [
        { titulo: 'Garcia-Garcia, C., Derbel, B., Morales-Reyes, A., & Escalante, H. J. (2025). Speeding up the multi-objective NAS through incremental learning. In L. Martínez-Villaseñor & G. Ochoa-Ruiz (Eds.), Advances in soft computing (pp. 3–15). Springer Nature Switzerland.', anio: 2025, enlace: 'https://doi.org/10.1007/978-3-031-75543-9_1' },
        { titulo: 'Garcia-Garcia, C., Morales-Reyes, A., & Escalante, H. J. (2024). Progressive selfsupervised multi-objective nas for image classification. International Conference on the Applications of Evolutionary Computation (Part of EvoStar), Aberystwyth, Wales, United Kingdom 3-5 April, 180–195.', anio: 2024, enlace: 'https://doi.org/10.1007/978-3-031-56855-8_11' },
        { titulo: 'Garcia-Garcia, C., Morales-Reyes, A., & Escalante, H. J. (2023a). Continuous cartesian genetic programming based representation for multi-objective neural architecture search. Applied Soft Computing, 147, 110788. ', anio: 2023, enlace: 'https://doi.org/10.1007/978-3-031-56855-8_11' },
        { titulo: 'Garcia-Garcia, C., Morales-Reyes, A., & Escalante, H. J. (2023b). Continuous Cartesian Genetic Programming based representation for Multi-Objective Neural Architecture Search for Image Classification [Poster Presentation]. Computer Vision and Pattern Recognition Conference: LatinX in AI (LXAI) Research Workshop 2023, Vancouver, Canada.', anio: 2023, enlace: 'https://research.latinxinai.org/papers/cvpr/2023/pdf/Cosijopii_Garcia.pdf' },
        { titulo: 'Garcia-Garcia, C., Escalante, H. J., & Morales-Reyes, A. (2022). CGP-NAS: Realbased solutions encoding for multi-objective evolutionary neural architecture search. Genetic and Evolutionary Computation Conference Companion (GECCO ’22 Companion), July 9–13, 2022, Boston, MA, USA, 1. ', anio: 2022, enlace: 'https://doi.org/10.1145/3520304' },
        { titulo: 'Garcia-Garcia, C., Martínez-Peñaloza, M.-G., & Morales-Reyes, A. (2020). cMOGA/D: a novel cellular GA based on decomposition to tackle constrained multiobjetive problems. In Genetic and Evolutionary Computation Conference Companion (GECCO ’20 Companion)', anio: 2020, enlace: 'https://doi.org/10.1145/3377929.3398137' },
        { titulo: 'Meléndez Acosta, N. J., Solano Monje, R., Garcia-Garcia, C., & Riós Figueroa, H. V. (2019). Ca-PSO: Coulomb attracting Particle Swarms. Programación Matemática y Software, ISSN :2007-3283, 3, 11.', anio: 2019, enlace: 'https://doi.org/doi.org/10.30973/progmat/2019.11.3/1' },
        { titulo: 'Solano Monje, R., Meléndez Acosta, N. J., Garcia-Garcia, C., & Riós Figueroa, H. V. (2018). C-PSO: Particle Swarm Optimization by Embedding Coulomb’s Law. COMIA, 12', anio: 2018, enlace: 'https://doi.org/10.13053/rcs-147-8-24' },
        { titulo: 'Garcia-Garcia, C., & Meléndez Acosta, N. J. (2017). Clasificación de género utilizando medidas antropométricas, análisis de texturas y la arquitectura ANFIS. Advances in Social Informatics and its Applications, 136, 33–46.', anio: 2017, enlace: 'https://doi.org/10.13053/rcs-136-1-3' }
      ]
    },
    {
      nombre: 'M. en C. Oscar Alonso de la Rosa Aguilar',
      especialidad: 'Maestría en Ciencias de la Computación',
      cargo: 'Profesor-Investigador de tiempo completo.',
      imagen: 'assets/img/Oscar.jpg',
      descripcion: 'Análisis de datos.',
      email: 'odelarosa@bianni.unistmo.edu.mx',
      publicaciones: [
        { titulo: 'New Method for Automatic Recognition of Mexican Indigenous Languages: Comparative Performance of Classifiers. SN Comput. Sci. 4(5): 649 (2023)', anio: 2023, enlace: 'https://doi.org/10.1007/s42000-023-01234-5' }
      ]
    },
    {
      nombre: 'M. en E. y C. Edgar Manuel Cano Cruz',
      especialidad: 'Maestría en Electrónica y Computación con especialidad en Sistemas Inteligentes Aplicados',
      cargo: 'Profesor Investigador de Tiempo Completo de la Licenciatura en Informática e Ingeniería en Desarrollo de Software y Sistemas Inteligentes',
      imagen: 'assets/img/Cano.png',
      descripcion: 'Sistemas empotrados.',
      email: 'ie.edgarcano@gmail.com',
      publicaciones: [
        { titulo: 'García, I., & Cano, E. (2018). A computer game for teaching and learning algebra topics at undergraduate level. Computer Applications in Engineering Education, 26(2), 326–340. doi:10.1002/cae.21887', anio: 2018, enlace: '#' },
        { titulo: 'Algredo Badillo , I. ., Sarmiento Torres, E. D., Atonal Nolasco, C. ., Cano Cruz, E. M., & Arellano Pimentel, J. (2015). Aplicación móvil para la automatización del método explicativo-ilustrativo para la enseñanza de idiomas. Programación matemática Y Software, 7(2), 1–7.', anio: 2015, enlace: 'https://doi.org/10.30973/progmat/2015.7.2/1' },
        { titulo: 'Cano-Cruz, E. M., & López-Orozco, F. (2015). Design and development of a lowcost and portable meteorological system: MeteoBlue. Advanced Science Letters, 21(1), 83–87.', anio: 2015, enlace: 'doi.org/10.1166/asl.2015.5760' },
        { titulo: 'Edgar Manuel Cano Cruz, Juan Andrés Velázquez Cruz, Juan Gabriel Ruiz Ruiz, Luis David Huerta Hernández. (2015). Video Games in Teaching-Learning Processes: A Brief Review. International Journal of Secondary Education, 2(6), 102-105. ISSN: 2376-7464. ', anio: 2015, enlace: 'doi.org/10.11648/j.ijsedu.20140206.12' },
        { titulo: 'Edgar Manuel Cano Cruz, Juan Gabriel Ruiz Ruiz. (2015). Educational Software to Teaching-Learning the Zapotec Language of the Istmo of Tehuantepec. Science Journal of Education, 3(2), 16-21. ISSN: 2329-0900.', anio: 2015, enlace: 'doi.org/10.11648/j.sjedu.20150302.11' },
        { titulo: 'Edgar Manuel Cano Cruz, Juan Gabriel Ruiz Ruiz. (2015), Portable Weather System for Measure and Monitoring Temperature, Relative Humidity, and Pressure, Based on Bluetooth Communication, American Journal of Networks and Communications. Vol. 4, No. 3, 2015, pp. 49-53. ISSN: 2326-893X.', anio: 2015, enlace: '#' },
        { titulo: 'I. A. Garcia, E. M. Cano (2014). Designing and implementing a constructionist approach for improving the teaching–learning process in the embedded systems and wireless communications areas. Computer Applications in Engineering Education. Volume22, Issue3.', anio: 2014, enlace: 'doi: 10.1002/cae.20574.' },
        { titulo: 'Cano, E. M., Ruiz, J. G., & Garcia, I. A. (2013). Integrating a learning constructionist environment and the instructional design approach into the definition of a basic course for embedded systems design. Computer Applications in Engineering Education, 23(1), 36–53.', anio: 2013, enlace: 'doi:10.1002/cae.21574' },
        { titulo: 'Cano, E., Ruiz, J., & Huerta, L. (2013). Gateway for Bluetooth and CAN Communications Protocols. Journal of Theoretical and Applied Information Technology, 55(3). ISSN: 1992-8645. ', anio: 2013, enlace: '#' },
        { titulo: 'E. Cano and I. Garcia. (2011). "Design and Development of a BlueBee Gateway for Bluetooth and ZigBee Wireless Protocols," 2011 IEEE Electronics, Robotics and Automotive Mechanics Conference, Cuernavaca, Mexico, 2011, pp. 366-370, doi: 10.1109/CERMA.2011.67.', anio: 2011, enlace: '#' }
      ]
    },
    {
      nombre: 'Lic. Florentino Ruiz Aquino',
      especialidad: 'Licenciado en Informática',
      cargo: 'Profesor Investigador de Tiempo Completo de la Licenciatura en Informática e Ingeniería en Desarrollo de Software y Sistemas Inteligentes',
      imagen: 'assets/img/Tino.jpeg',
      descripcion: 'Sistemas Inteligentes.',
      email: 'FRuizAquino@gmail.com',
      publicaciones: [
      ]
    }
  ]);
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
