export interface NewsItem {
  id: string
  title: string
  description: string
  content: string
  imageUrl: string
  date: string
  category: 'Clases de apoyo' | 'Proyectos' | 'Becas' | 'Eventos'
}

export const mockNews: NewsItem[] = [
  {
    id: 'clases-apoyo-2026',
    title: 'Nuevos horarios para las Clases de Apoyo Académico',
    description: 'Se habilitaron nuevas tutorías de Álgebra, Análisis Matemático y Programación para el cuatrimestre en curso.',
    content: `
      <p>Nos complace anunciar la apertura de nuevos horarios y comisiones para las <strong>Clases de Apoyo Académico</strong> de este cuatrimestre. El Programa de Tutorías y Acompañamiento Académico (PEA) ha coordinado con los tutores para brindar mayores opciones horarias y dar respuesta a la gran demanda registrada.</p>
      
      <h3>Materias y Horarios</h3>
      <ul>
        <li><strong>Álgebra I:</strong> Martes y Jueves de 14:00 a 16:00 hs - Aula 4.</li>
        <li><strong>Análisis Matemático I:</strong> Lunes y Miércoles de 16:00 a 18:00 hs - Aula 6.</li>
        <li><strong>Introducción a la Programación:</strong> Jueves de 18:00 a 20:00 hs - Laboratorio de Informática.</li>
      </ul>

      <p>Las clases son abiertas a todos los estudiantes de la Universidad Nacional de Tierra del Fuego (UNTDF). No es necesario realizar una inscripción previa; solo debes presentarte en las aulas indicadas con tus materiales de estudio y dudas particulares.</p>
      <p>¡Te esperamos para seguir potenciando tu trayecto académico!</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    date: '18 de Junio, 2026',
    category: 'Clases de apoyo',
  },
  {
    id: 'proyectos-investigacion-pea',
    title: 'Convocatoria a Proyectos de Investigación Estudiantil',
    description: 'Presenta tu propuesta científica o tecnológica y accede al financiamiento anual del PEA para estudiantes avanzados.',
    content: `
      <p>Queda oficialmente abierta la convocatoria anual para la presentación de <strong>Proyectos de Investigación Estudiantil</strong> bajo la tutoría de docentes investigadores de la UNTDF.</p>
      
      <h3>Requisitos para participar</h3>
      <p>La convocatoria está destinada a estudiantes regulares de grado que cumplan con los siguientes requisitos:</p>
      <ul>
        <li>Tener aprobado al menos el 50% de la carrera correspondiente.</li>
        <li>Contar con un docente tutor con categoría de investigador dentro de la UNTDF.</li>
        <li>Presentar una propuesta de investigación que aborde problemáticas regionales de Tierra del Fuego.</li>
      </ul>

      <h3>Plazos y Financiamiento</h3>
      <p>Las propuestas se recibirán de manera digital hasta el 15 de Julio de 2026. Los proyectos seleccionados contarán con financiamiento para materiales, equipamiento científico y salidas de campo.</p>
      <p>Para más información y descarga de formularios, acércate a la oficina del PEA o escríbenos a nuestro correo de contacto.</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800',
    date: '15 de Junio, 2026',
    category: 'Proyectos',
  },
  {
    id: 'becas-estimulo-inscripciones',
    title: 'Apertura de inscripciones para las Becas Estímulo 2026',
    description: 'Abrió la convocatoria de becas de ayuda económica y becas de comedor para el período académico del segundo cuatrimestre.',
    content: `
      <p>La Secretaría de Bienestar Universitario y el PEA anuncian la apertura de la convocatoria para las <strong>Becas Estímulo y Comedor 2026</strong> correspondientes al segundo tramo del año académico.</p>
      
      <h3>Tipos de Becas Disponibles</h3>
      <ol>
        <li><strong>Beca Estímulo Económico:</strong> Dirigida a estudiantes en situación de vulnerabilidad social y económica, con el fin de contribuir a los gastos de apuntes y transporte.</li>
        <li><strong>Beca de Comedor Universitario:</strong> Otorga menús diarios sin costo en las sedes de la UNTDF.</li>
      </ol>

      <p>Las inscripciones se realizan de manera 100% online a través del sistema de becas de la universidad. Deberás adjuntar la documentación que respalde tu situación socioeconómica (certificados de ingresos del grupo familiar, certificado de regularidad, etc.).</p>
      <p><strong>Fecha límite de inscripción:</strong> 30 de Junio de 2026.</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800',
    date: '10 de Junio, 2026',
    category: 'Becas',
  },
  {
    id: 'torneo-deportes-universitarios',
    title: 'Torneo Interfacultades de Deportes Universitarios',
    description: 'Inscríbete con tu equipo al torneo anual de Futsal, Vóley y Básquet representativo de las distintas carreras.',
    content: `
      <p>La Secretaría de Deportes del PEA convoca a todos los estudiantes a sumarse al tradicional <strong>Torneo Interfacultades UNTDF 2026</strong>.</p>
      
      <h3>Disciplinas Deportivas</h3>
      <p>Este año competiremos en las siguientes categorías (femenino, masculino y mixto):</p>
      <ul>
        <li>Futsal</li>
        <li>Vóley</li>
        <li>Básquet 3x3</li>
        <li>Ajedrez</li>
      </ul>

      <p>El objetivo del torneo es fomentar el compañerismo, la vida saludable y la recreación dentro de la comunidad estudiantil. Los partidos se disputarán los fines de semana en el gimnasio del campus universitario de Ushuaia y Río Grande.</p>
      <p>Arma tu equipo con compañeros de tu carrera e inscríbete a través del formulario de la Secretaría de Deportes antes del 5 de Julio.</p>
    `,
    imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=800',
    date: '5 de Junio, 2026',
    category: 'Eventos',
  },
]

export async function getNews(): Promise<NewsItem[]> {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockNews), 200)
  })
}

export async function getNewsById(id: string): Promise<NewsItem | undefined> {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockNews.find((item) => item.id === id)), 150)
  })
}
