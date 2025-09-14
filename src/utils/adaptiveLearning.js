// Sistema de aprendizaje adaptativo para el tutor ICT
export class AdaptiveLearningSystem {
  constructor() {
    this.userProfile = this.loadUserProfile()
    this.learningPath = []
    this.weakAreas = new Set()
    this.strongAreas = new Set()
  }

  // Cargar perfil del usuario desde localStorage
  loadUserProfile() {
    const saved = localStorage.getItem('ict-tutor-profile')
    if (saved) {
      return JSON.parse(saved)
    }
    
    return {
      level: 'beginner', // beginner, intermediate, advanced
      studyTime: 0, // minutes studied
      questionsAnswered: 0,
      correctAnswers: 0,
      chapterProgress: {},
      weakTopics: [],
      strongTopics: [],
      examDate: null,
      studyGoal: 'general', // general, exam, review
      lastActivity: null,
      streakDays: 0
    }
  }

  // Guardar perfil del usuario
  saveUserProfile() {
    localStorage.setItem('ict-tutor-profile', JSON.stringify(this.userProfile))
  }

  // Analizar rendimiento del usuario
  analyzePerformance(answers) {
    const analysis = {
      totalQuestions: answers.length,
      correctAnswers: 0,
      incorrectAnswers: 0,
      topicPerformance: {},
      difficultyPerformance: {
        easy: { correct: 0, total: 0 },
        medium: { correct: 0, total: 0 },
        hard: { correct: 0, total: 0 }
      },
      timePerformance: {
        fast: 0, // < 30 seconds
        normal: 0, // 30-120 seconds
        slow: 0 // > 120 seconds
      }
    }

    answers.forEach(answer => {
      if (answer.isCorrect) {
        analysis.correctAnswers++
      } else {
        analysis.incorrectAnswers++
      }

      // Análisis por tema
      const topic = answer.chapter || 'unknown'
      if (!analysis.topicPerformance[topic]) {
        analysis.topicPerformance[topic] = { correct: 0, total: 0 }
      }
      analysis.topicPerformance[topic].total++
      if (answer.isCorrect) {
        analysis.topicPerformance[topic].correct++
      }

      // Análisis por dificultad
      const difficulty = answer.difficulty || 'medium'
      analysis.difficultyPerformance[difficulty].total++
      if (answer.isCorrect) {
        analysis.difficultyPerformance[difficulty].correct++
      }

      // Análisis de tiempo
      const timeSpent = answer.timeSpent || 60
      if (timeSpent < 30) {
        analysis.timePerformance.fast++
      } else if (timeSpent <= 120) {
        analysis.timePerformance.normal++
      } else {
        analysis.timePerformance.slow++
      }
    })

    return analysis
  }

  // Actualizar perfil basado en el rendimiento
  updateProfile(sessionData) {
    const analysis = this.analyzePerformance(sessionData.answers || [])
    
    // Actualizar estadísticas básicas
    this.userProfile.questionsAnswered += analysis.totalQuestions
    this.userProfile.correctAnswers += analysis.correctAnswers
    this.userProfile.studyTime += sessionData.timeSpent || 0
    this.userProfile.lastActivity = new Date().toISOString()

    // Actualizar nivel del usuario
    this.updateUserLevel(analysis)

    // Identificar áreas débiles y fuertes
    this.updateTopicStrengths(analysis.topicPerformance)

    // Actualizar progreso por capítulo
    this.updateChapterProgress(analysis.topicPerformance)

    // Actualizar racha de estudio
    this.updateStudyStreak()

    this.saveUserProfile()
  }

  // Actualizar nivel del usuario
  updateUserLevel(analysis) {
    const accuracy = analysis.totalQuestions > 0 ? 
      (analysis.correctAnswers / analysis.totalQuestions) * 100 : 0

    const totalQuestions = this.userProfile.questionsAnswered

    if (totalQuestions >= 100 && accuracy >= 85) {
      this.userProfile.level = 'advanced'
    } else if (totalQuestions >= 50 && accuracy >= 70) {
      this.userProfile.level = 'intermediate'
    } else {
      this.userProfile.level = 'beginner'
    }
  }

  // Actualizar fortalezas y debilidades por tema
  updateTopicStrengths(topicPerformance) {
    Object.entries(topicPerformance).forEach(([topic, performance]) => {
      const accuracy = performance.total > 0 ? 
        (performance.correct / performance.total) * 100 : 0

      if (performance.total >= 3) { // Mínimo 3 preguntas para considerar
        if (accuracy >= 80) {
          this.userProfile.strongTopics = this.userProfile.strongTopics.filter(t => t !== topic)
          this.userProfile.strongTopics.push(topic)
          this.strongAreas.add(topic)
          this.weakAreas.delete(topic)
        } else if (accuracy < 60) {
          this.userProfile.weakTopics = this.userProfile.weakTopics.filter(t => t !== topic)
          this.userProfile.weakTopics.push(topic)
          this.weakAreas.add(topic)
          this.strongAreas.delete(topic)
        }
      }
    })

    // Mantener solo los últimos 5 temas débiles y fuertes
    this.userProfile.weakTopics = this.userProfile.weakTopics.slice(-5)
    this.userProfile.strongTopics = this.userProfile.strongTopics.slice(-5)
  }

  // Actualizar progreso por capítulo
  updateChapterProgress(topicPerformance) {
    Object.entries(topicPerformance).forEach(([topic, performance]) => {
      if (!this.userProfile.chapterProgress[topic]) {
        this.userProfile.chapterProgress[topic] = {
          questionsAnswered: 0,
          correctAnswers: 0,
          lastStudied: null,
          mastery: 0
        }
      }

      const chapter = this.userProfile.chapterProgress[topic]
      chapter.questionsAnswered += performance.total
      chapter.correctAnswers += performance.correct
      chapter.lastStudied = new Date().toISOString()
      
      // Calcular nivel de dominio (0-100)
      chapter.mastery = chapter.questionsAnswered > 0 ? 
        Math.round((chapter.correctAnswers / chapter.questionsAnswered) * 100) : 0
    })
  }

  // Actualizar racha de estudio
  updateStudyStreak() {
    const today = new Date().toDateString()
    const lastActivity = this.userProfile.lastActivity ? 
      new Date(this.userProfile.lastActivity).toDateString() : null

    if (lastActivity === today) {
      // Ya estudió hoy, mantener racha
      return
    }

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toDateString()

    if (lastActivity === yesterdayStr) {
      // Estudió ayer, incrementar racha
      this.userProfile.streakDays++
    } else if (lastActivity !== today) {
      // No estudió ayer, reiniciar racha
      this.userProfile.streakDays = 1
    }
  }

  // Generar recomendaciones personalizadas
  generateRecommendations() {
    const recommendations = []

    // Recomendaciones basadas en áreas débiles
    if (this.userProfile.weakTopics.length > 0) {
      recommendations.push({
        type: 'weak_areas',
        priority: 'high',
        title: 'Refuerza tus áreas débiles',
        description: `Te recomendamos repasar: ${this.userProfile.weakTopics.slice(0, 3).join(', ')}`,
        action: 'study_weak_topics',
        topics: this.userProfile.weakTopics.slice(0, 3)
      })
    }

    // Recomendaciones basadas en el nivel
    if (this.userProfile.level === 'beginner') {
      recommendations.push({
        type: 'level_based',
        priority: 'medium',
        title: 'Comienza con lo básico',
        description: 'Te sugerimos empezar con el Capítulo I: Disposiciones Generales',
        action: 'study_chapter',
        chapter: 'Capítulo I'
      })
    } else if (this.userProfile.level === 'advanced') {
      recommendations.push({
        type: 'level_based',
        priority: 'medium',
        title: 'Practica con simulacros',
        description: 'Estás listo para simulacros de examen completos',
        action: 'take_exam',
        difficulty: 'hard'
      })
    }

    // Recomendaciones basadas en tiempo de estudio
    const hoursStudied = this.userProfile.studyTime / 60
    if (hoursStudied < 5) {
      recommendations.push({
        type: 'study_time',
        priority: 'low',
        title: 'Establece una rutina',
        description: 'Dedica al menos 30 minutos diarios al estudio',
        action: 'set_study_schedule'
      })
    }

    // Recomendaciones basadas en la fecha del examen
    if (this.userProfile.examDate) {
      const daysUntilExam = Math.ceil(
        (new Date(this.userProfile.examDate) - new Date()) / (1000 * 60 * 60 * 24)
      )
      
      if (daysUntilExam <= 7) {
        recommendations.push({
          type: 'exam_preparation',
          priority: 'urgent',
          title: 'Examen próximo',
          description: `Te quedan ${daysUntilExam} días. Enfócate en simulacros y repaso`,
          action: 'intensive_review',
          daysLeft: daysUntilExam
        })
      }
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }

  // Generar plan de estudio personalizado
  generateStudyPlan(targetDate = null, hoursPerDay = 1) {
    const plan = {
      totalDays: 30,
      dailyGoals: [],
      weeklyMilestones: [],
      focusAreas: []
    }

    if (targetDate) {
      const daysUntilExam = Math.ceil(
        (new Date(targetDate) - new Date()) / (1000 * 60 * 60 * 24)
      )
      plan.totalDays = Math.max(7, daysUntilExam)
    }

    // Determinar áreas de enfoque
    if (this.userProfile.weakTopics.length > 0) {
      plan.focusAreas = [...this.userProfile.weakTopics]
    } else {
      plan.focusAreas = ['Capítulo I', 'Capítulo II', 'Anexo I', 'Anexo II', 'Anexo III']
    }

    // Generar objetivos diarios
    for (let day = 1; day <= plan.totalDays; day++) {
      const focusArea = plan.focusAreas[(day - 1) % plan.focusAreas.length]
      
      plan.dailyGoals.push({
        day,
        focusArea,
        activities: this.generateDailyActivities(focusArea, hoursPerDay),
        estimatedTime: hoursPerDay * 60 // en minutos
      })
    }

    // Generar hitos semanales
    const weeks = Math.ceil(plan.totalDays / 7)
    for (let week = 1; week <= weeks; week++) {
      plan.weeklyMilestones.push({
        week,
        goal: this.generateWeeklyGoal(week, weeks),
        assessment: 'quiz' // quiz, exam, review
      })
    }

    return plan
  }

  // Generar actividades diarias
  generateDailyActivities(focusArea, hoursAvailable) {
    const activities = []
    const timePerActivity = (hoursAvailable * 60) / 3 // 3 actividades por sesión

    activities.push({
      type: 'study',
      title: `Estudiar ${focusArea}`,
      duration: timePerActivity,
      description: `Revisar conceptos clave y artículos de ${focusArea}`
    })

    activities.push({
      type: 'practice',
      title: 'Preguntas de práctica',
      duration: timePerActivity,
      description: `Resolver 10-15 preguntas sobre ${focusArea}`
    })

    activities.push({
      type: 'review',
      title: 'Repaso y notas',
      duration: timePerActivity,
      description: 'Revisar errores y tomar notas importantes'
    })

    return activities
  }

  // Generar objetivo semanal
  generateWeeklyGoal(week, totalWeeks) {
    if (week === 1) {
      return 'Dominar conceptos básicos y disposiciones generales'
    } else if (week === totalWeeks) {
      return 'Simulacros finales y repaso intensivo'
    } else {
      return `Completar estudio de anexos técnicos (Semana ${week})`
    }
  }

  // Obtener estadísticas del usuario
  getUserStats() {
    const accuracy = this.userProfile.questionsAnswered > 0 ? 
      Math.round((this.userProfile.correctAnswers / this.userProfile.questionsAnswered) * 100) : 0

    return {
      level: this.userProfile.level,
      accuracy,
      questionsAnswered: this.userProfile.questionsAnswered,
      studyTime: Math.round(this.userProfile.studyTime / 60 * 10) / 10, // horas con 1 decimal
      streakDays: this.userProfile.streakDays,
      weakTopics: this.userProfile.weakTopics,
      strongTopics: this.userProfile.strongTopics,
      chapterProgress: this.userProfile.chapterProgress
    }
  }

  // Configurar objetivo de estudio
  setStudyGoal(goal, examDate = null) {
    this.userProfile.studyGoal = goal
    if (examDate) {
      this.userProfile.examDate = examDate
    }
    this.saveUserProfile()
  }

  // Resetear progreso (para testing o nuevo inicio)
  resetProgress() {
    this.userProfile = {
      level: 'beginner',
      studyTime: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      chapterProgress: {},
      weakTopics: [],
      strongTopics: [],
      examDate: null,
      studyGoal: 'general',
      lastActivity: null,
      streakDays: 0
    }
    this.saveUserProfile()
  }
}

// Instancia global del sistema de aprendizaje adaptativo
export const adaptiveLearning = new AdaptiveLearningSystem()

