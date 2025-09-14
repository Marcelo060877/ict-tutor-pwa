// Datos estructurados del Reglamento ICT de España
export const ictData = {
  chapters: [
    {
      id: 'cap1',
      title: 'CAPÍTULO I: Disposiciones Generales',
      description: 'Establece el objeto, definiciones y ámbito de aplicación del reglamento',
      articles: [
        {
          id: 'art1',
          number: 1,
          title: 'Objeto',
          content: `Este reglamento tiene por objeto establecer las reglas técnicas para que todos los edificios tengan una infraestructura de telecomunicaciones (ICT) que permita:

1. El acceso a servicios de radiodifusión sonora y televisión
2. El acceso a servicios de telefonía y banda ancha

El objetivo principal es garantizar el derecho de los usuarios a acceder a los servicios y fomentar la libre competencia entre operadores.`,
          keyPoints: [
            'Establece reglas técnicas para ICT en edificios',
            'Garantiza acceso a servicios de RTV y telecomunicaciones',
            'Fomenta la libre competencia entre operadores',
            'Protege el derecho de los usuarios'
          ],
          examTips: [
            'El objetivo principal es garantizar derechos y competencia',
            'No regula precios, solo infraestructuras',
            'Aplica a edificios bajo régimen de propiedad horizontal'
          ]
        },
        {
          id: 'art2',
          number: 2,
          title: 'Definiciones',
          content: `A efectos de este reglamento se entiende por:

**ICT (Infraestructura Común de Telecomunicaciones):** Conjunto de sistemas y redes instaladas en un edificio para captar, adaptar y distribuir señales de telecomunicaciones.

**Hogar Digital:** Lugar donde las necesidades de seguridad, confort, comunicación y eficiencia energética son atendidas mediante la convergencia de servicios e infraestructuras.

**Operador:** Empresa que presta servicios de telecomunicaciones al público.

**Usuario:** Persona física o jurídica que utiliza o solicita un servicio de telecomunicaciones.`,
          keyPoints: [
            'ICT: infraestructura común del edificio',
            'Hogar Digital: convergencia de servicios',
            'Operador: empresa prestadora de servicios',
            'Usuario: persona que utiliza los servicios'
          ],
          examTips: [
            'Memorizar la definición exacta de ICT',
            'Hogar Digital incluye 4 aspectos: seguridad, confort, comunicación, eficiencia',
            'Distinguir entre operador y usuario'
          ]
        },
        {
          id: 'art3',
          number: 3,
          title: 'Ámbito de aplicación',
          content: `Este reglamento se aplica a:

1. **Edificios de nueva construcción** bajo régimen de propiedad horizontal
2. **Edificios existentes** que se rehabiliten integralmente
3. **Viviendas unifamiliares** que formen parte de una urbanización en régimen de propiedad horizontal

**Excepciones:**
- Viviendas unifamiliares aisladas
- Edificios de uso exclusivamente industrial
- Edificios histórico-artísticos con limitaciones técnicas`,
          keyPoints: [
            'Aplica a edificios en régimen de propiedad horizontal',
            'Incluye nueva construcción y rehabilitación integral',
            'Viviendas unifamiliares solo si están en urbanización',
            'Excepciones específicas definidas'
          ],
          examTips: [
            'Clave: régimen de propiedad horizontal',
            'Vivienda unifamiliar aislada NO está obligada',
            'Rehabilitación debe ser integral, no parcial'
          ]
        }
      ]
    },
    {
      id: 'cap2',
      title: 'CAPÍTULO II: Infraestructura Común',
      description: 'Regula las obligaciones, normativa técnica y ejecución de la ICT',
      articles: [
        {
          id: 'art4',
          number: 4,
          title: 'Normativa técnica aplicable',
          content: `La ICT debe cumplir con:

1. **Normas UNE** aplicables
2. **Reglamento Electrotécnico de Baja Tensión**
3. **Normativa de compatibilidad electromagnética**
4. **Anexos técnicos** de este reglamento

Las instalaciones deben permitir la evolución tecnológica y la prestación de nuevos servicios.`,
          keyPoints: [
            'Cumplimiento de normas UNE',
            'Aplicación del REBT',
            'Compatibilidad electromagnética',
            'Preparación para evolución tecnológica'
          ],
          examTips: [
            'Múltiples normativas aplicables simultáneamente',
            'Importante la preparación para futuro',
            'REBT es obligatorio para instalaciones eléctricas'
          ]
        }
      ]
    }
  ],
  
  annexes: [
    {
      id: 'anexo1',
      title: 'ANEXO I: Radiodifusión sonora y Televisión',
      description: 'Norma técnica para servicios de RTV terrestres y por satélite',
      sections: [
        {
          id: 'a1s1',
          title: 'Objeto y ámbito de aplicación',
          content: 'Establece los requisitos técnicos para la captación, adaptación y distribución de señales de RTV.'
        }
      ]
    },
    {
      id: 'anexo2', 
      title: 'ANEXO II: Banda Ancha y Telefonía',
      description: 'Norma técnica para servicios de telecomunicaciones de banda ancha',
      sections: [
        {
          id: 'a2s1',
          title: 'Objeto y ámbito',
          content: 'Define los requisitos para servicios de telefonía y acceso a internet de alta velocidad.'
        }
      ]
    },
    {
      id: 'anexo3',
      title: 'ANEXO III: Especificaciones Técnicas',
      description: 'Especificaciones técnicas mínimas de las edificaciones',
      sections: [
        {
          id: 'a3s1',
          title: 'Recintos de telecomunicaciones',
          content: `**RITI (Recinto Inferior):** Para servicios de telefonía y banda ancha
**RITS (Recinto Superior):** Para servicios de RTV y SAI  
**RITU (Recinto Único):** Combina RITI y RITS en edificios pequeños

**Dimensiones mínimas arqueta de entrada:**
- Hasta 20 PAU: 400 x 400 x 600 mm
- Más de 20 PAU: 600 x 600 x 800 mm`
        }
      ]
    }
  ],

  glossary: {
    'ICT': {
      term: 'ICT',
      fullName: 'Infraestructura Común de Telecomunicaciones',
      definition: 'Conjunto de sistemas y redes instaladas en un edificio para captar, adaptar y distribuir señales de telecomunicaciones hasta el domicilio de cada usuario.',
      category: 'general',
      relatedTerms: ['RITI', 'RITS', 'PAU', 'BAT'],
      chapter: 'Artículo 2'
    },
    'RITI': {
      term: 'RITI',
      fullName: 'Recinto de Instalaciones de Telecomunicación Inferior',
      definition: 'Local o habitáculo donde se instalan los registros principales correspondientes a los servicios de telefonía disponible al público y de telecomunicaciones de banda ancha.',
      category: 'recintos',
      relatedTerms: ['RITS', 'RITU', 'Registros principales'],
      chapter: 'Anexo III'
    },
    'RITS': {
      term: 'RITS', 
      fullName: 'Recinto de Instalaciones de Telecomunicación Superior',
      definition: 'Local o habitáculo donde se instalan los elementos necesarios para el suministro de los servicios de RTV y, en su caso, elementos de los servicios de acceso inalámbrico (SAI).',
      category: 'recintos',
      relatedTerms: ['RITI', 'RITU', 'RTV', 'SAI'],
      chapter: 'Anexo III'
    },
    'RITU': {
      term: 'RITU',
      fullName: 'Recinto de Instalaciones de Telecomunicación Único',
      definition: 'Recinto que acumula la funcionalidad del RITI y RITS, permitido en edificios de hasta tres alturas y planta baja con máximo 16 PAU.',
      category: 'recintos',
      relatedTerms: ['RITI', 'RITS', 'PAU'],
      chapter: 'Anexo III'
    },
    'PAU': {
      term: 'PAU',
      fullName: 'Punto de Acceso al Usuario',
      definition: 'Lugar donde se produce la unión de las redes de dispersión e interiores de cada usuario de la ICT de la edificación.',
      category: 'conexiones',
      relatedTerms: ['BAT', 'Red de dispersión', 'Red interior'],
      chapter: 'Anexo III'
    },
    'BAT': {
      term: 'BAT',
      fullName: 'Base de Acceso Terminal',
      definition: 'Punto donde el usuario conecta los equipos terminales que le permiten acceder a los servicios de telecomunicación que proporciona la ICT.',
      category: 'conexiones',
      relatedTerms: ['PAU', 'Equipos terminales'],
      chapter: 'Anexo III'
    },
    'RTV': {
      term: 'RTV',
      fullName: 'Radiodifusión sonora y Televisión',
      definition: 'Servicios de radiodifusión sonora y televisión, tanto terrestres como por satélite, que deben ser distribuidos por la ICT.',
      category: 'servicios',
      relatedTerms: ['TDT', 'Satélite', 'RITS'],
      chapter: 'Anexo I'
    },
    'TBA': {
      term: 'TBA',
      fullName: 'Telecomunicaciones de Banda Ancha',
      definition: 'Servicios de telecomunicaciones que permiten el acceso a internet de alta velocidad y otros servicios de banda ancha.',
      category: 'servicios',
      relatedTerms: ['Fibra óptica', 'Cable coaxial', 'ADSL'],
      chapter: 'Anexo II'
    }
  },

  examQuestions: [
    {
      id: 1,
      type: 'multiple',
      difficulty: 'easy',
      chapter: 'Capítulo I',
      question: '¿Cuál es el objetivo principal del Reglamento ICT?',
      options: [
        'Garantizar el derecho de acceso a servicios y fomentar la libre competencia',
        'Regular únicamente la instalación de antenas',
        'Establecer precios de telecomunicaciones',
        'Controlar el uso de internet en edificios'
      ],
      correct: 0,
      explanation: 'El objetivo principal es garantizar el derecho de los usuarios a acceder a los servicios y fomentar la libre competencia entre operadores, según se establece en el Artículo 1.'
    },
    {
      id: 2,
      type: 'boolean',
      difficulty: 'medium',
      chapter: 'Capítulo I',
      question: '¿Es obligatorio instalar ICT en todas las viviendas unifamiliares?',
      options: ['Verdadero', 'Falso'],
      correct: 1,
      explanation: 'Falso. La ICT es obligatoria solo en edificios bajo régimen de propiedad horizontal. Las viviendas unifamiliares aisladas no están obligadas, salvo que formen parte de una urbanización en régimen de propiedad horizontal.'
    },
    {
      id: 3,
      type: 'multiple',
      difficulty: 'hard',
      chapter: 'Anexo III',
      question: '¿Cuáles son las dimensiones mínimas de la arqueta de entrada para edificios de hasta 20 PAU?',
      options: [
        '300 x 300 x 500 mm',
        '400 x 400 x 600 mm',
        '500 x 500 x 700 mm',
        '600 x 600 x 800 mm'
      ],
      correct: 1,
      explanation: 'Según el Anexo III, para edificios de hasta 20 PAU las dimensiones mínimas son 400 x 400 x 600 mm.'
    },
    {
      id: 4,
      type: 'multiple',
      difficulty: 'medium',
      chapter: 'Anexo III',
      question: '¿Qué significa RITU?',
      options: [
        'Recinto de Instalaciones de Telecomunicación Unificado',
        'Recinto de Instalaciones de Telecomunicación Único',
        'Red de Instalaciones de Telecomunicación Universal',
        'Registro de Instalaciones de Telecomunicación Urbano'
      ],
      correct: 1,
      explanation: 'RITU significa Recinto de Instalaciones de Telecomunicación Único, que combina las funciones del RITI y RITS en edificios pequeños.'
    },
    {
      id: 5,
      type: 'boolean',
      difficulty: 'easy',
      chapter: 'Capítulo I',
      question: '¿El Hogar Digital incluye aspectos de eficiencia energética?',
      options: ['Verdadero', 'Falso'],
      correct: 0,
      explanation: 'Verdadero. El Hogar Digital atiende necesidades de seguridad, confort, comunicación y eficiencia energética mediante la convergencia de servicios e infraestructuras.'
    }
  ]
}

export default ictData

