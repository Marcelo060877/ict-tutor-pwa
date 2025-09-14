import { useState, useEffect } from 'react'
import { Clock, Play, Pause, RotateCcw, FileText, Target, AlertCircle, CheckCircle, XCircle, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ictData } from '../data/ictData'

const Simulacro = ({ onNavigate }) => {
  const [examState, setExamState] = useState('setup') // setup, running, paused, completed
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(3600) // 60 minutes
  const [examStartTime, setExamStartTime] = useState(null)
  const [examConfig, setExamConfig] = useState({
    duration: 60, // minutes
    questionCount: 20,
    difficulty: 'mixed',
    chapters: 'all'
  })

  // Generate exam questions based on config
  const generateExamQuestions = () => {
    let availableQuestions = [...ictData.examQuestions]
    
    if (examConfig.difficulty !== 'mixed') {
      availableQuestions = availableQuestions.filter(q => q.difficulty === examConfig.difficulty)
    }
    
    if (examConfig.chapters !== 'all') {
      availableQuestions = availableQuestions.filter(q => 
        q.chapter.toLowerCase().includes(examConfig.chapters.toLowerCase())
      )
    }
    
    // Shuffle and take the required number of questions
    const shuffled = availableQuestions.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, Math.min(examConfig.questionCount, shuffled.length))
  }

  const [examQuestions, setExamQuestions] = useState([])

  // Timer effect
  useEffect(() => {
    if (examState === 'running' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && examState === 'running') {
      handleTimeUp()
    }
  }, [timeLeft, examState])

  const handleTimeUp = () => {
    setExamState('completed')
  }

  const startExam = () => {
    const questions = generateExamQuestions()
    setExamQuestions(questions)
    setTimeLeft(examConfig.duration * 60)
    setExamStartTime(Date.now())
    setExamState('running')
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
  }

  const pauseExam = () => {
    setExamState('paused')
  }

  const resumeExam = () => {
    setExamState('running')
  }

  const finishExam = () => {
    setExamState('completed')
  }

  const restartExam = () => {
    setExamState('setup')
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setTimeLeft(examConfig.duration * 60)
    setExamStartTime(null)
  }

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const navigateToQuestion = (index) => {
    setCurrentQuestionIndex(index)
  }

  const getResults = () => {
    let correct = 0
    let answered = 0
    
    examQuestions.forEach(question => {
      if (selectedAnswers[question.id] !== undefined) {
        answered++
        if (selectedAnswers[question.id] === question.correct) {
          correct++
        }
      }
    })
    
    const percentage = answered > 0 ? Math.round((correct / answered) * 100) : 0
    const totalPercentage = examQuestions.length > 0 ? Math.round((correct / examQuestions.length) * 100) : 0
    
    return {
      correct,
      incorrect: answered - correct,
      unanswered: examQuestions.length - answered,
      answered,
      total: examQuestions.length,
      percentage,
      totalPercentage,
      timeSpent: examConfig.duration * 60 - timeLeft,
      passed: totalPercentage >= 60
    }
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getQuestionStatus = (questionIndex) => {
    const question = examQuestions[questionIndex]
    if (!question) return 'unanswered'
    
    if (selectedAnswers[question.id] !== undefined) {
      return 'answered'
    }
    return 'unanswered'
  }

  const getQuestionStatusColor = (status) => {
    switch (status) {
      case 'answered': return 'bg-green-500 text-white'
      case 'current': return 'bg-blue-500 text-white'
      default: return 'bg-gray-200 text-gray-700'
    }
  }

  // Setup Screen
  if (examState === 'setup') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Simulacro de Examen</h1>
          <p className="text-gray-600">Configura tu examen de práctica del Reglamento ICT</p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Configuración del Examen
            </CardTitle>
            <CardDescription>
              Personaliza tu simulacro según tus necesidades de estudio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración (minutos)
                </label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={examConfig.duration}
                  onChange={(e) => setExamConfig(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                >
                  <option value={30}>30 minutos</option>
                  <option value={45}>45 minutos</option>
                  <option value={60}>60 minutos</option>
                  <option value={90}>90 minutos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de preguntas
                </label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={examConfig.questionCount}
                  onChange={(e) => setExamConfig(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                >
                  <option value={10}>10 preguntas</option>
                  <option value={15}>15 preguntas</option>
                  <option value={20}>20 preguntas</option>
                  <option value={25}>25 preguntas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dificultad
                </label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={examConfig.difficulty}
                  onChange={(e) => setExamConfig(prev => ({ ...prev, difficulty: e.target.value }))}
                >
                  <option value="mixed">Mixta</option>
                  <option value="easy">Fácil</option>
                  <option value="medium">Medio</option>
                  <option value="hard">Difícil</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capítulos
                </label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={examConfig.chapters}
                  onChange={(e) => setExamConfig(prev => ({ ...prev, chapters: e.target.value }))}
                >
                  <option value="all">Todos los capítulos</option>
                  <option value="capitulo">Solo Capítulos</option>
                  <option value="anexo">Solo Anexos</option>
                </select>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Condiciones del examen:</strong> Una vez iniciado, el tiempo correrá continuamente. 
                Puedes pausar el examen, pero se recomienda completarlo de una vez para simular condiciones reales.
              </AlertDescription>
            </Alert>

            <div className="flex justify-center">
              <Button onClick={startExam} size="lg" className="px-8">
                <Play className="h-5 w-5 mr-2" />
                Iniciar Examen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Completed Screen
  if (examState === 'completed') {
    const results = getResults()
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">¡Examen Completado!</h1>
          <p className="text-gray-600">Aquí tienes tus resultados detallados</p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Resultados del Simulacro</CardTitle>
            <CardDescription>
              {results.passed ? (
                <span className="text-green-600 font-semibold">¡Felicidades! Has aprobado el examen</span>
              ) : (
                <span className="text-red-600 font-semibold">No has alcanzado la nota mínima (60%)</span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Score */}
            <div className="text-center">
              <div className={`text-6xl font-bold mb-2 ${results.passed ? 'text-green-600' : 'text-red-600'}`}>
                {results.totalPercentage}%
              </div>
              <div className="text-lg text-gray-600">
                {results.correct} de {results.total} preguntas correctas
              </div>
            </div>

            <Progress value={results.totalPercentage} className="h-4" />

            {/* Detailed Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{results.correct}</div>
                <div className="text-sm text-green-800">Correctas</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{results.incorrect}</div>
                <div className="text-sm text-red-800">Incorrectas</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{results.unanswered}</div>
                <div className="text-sm text-gray-800">Sin responder</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{formatTime(results.timeSpent)}</div>
                <div className="text-sm text-blue-800">Tiempo usado</div>
              </div>
            </div>

            {/* Question Review */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Revisión de Preguntas</h3>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                {examQuestions.map((question, index) => {
                  const userAnswer = selectedAnswers[question.id]
                  const isCorrect = userAnswer === question.correct
                  const isAnswered = userAnswer !== undefined
                  
                  return (
                    <div
                      key={question.id}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium ${
                        !isAnswered ? 'bg-gray-200 text-gray-600' :
                        isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}
                    >
                      {index + 1}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <Button onClick={restartExam}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Nuevo Examen
              </Button>
              <Button variant="outline" onClick={() => onNavigate('temario')}>
                Repasar Temario
              </Button>
              <Button variant="outline" onClick={() => onNavigate('preguntas')}>
                Practicar Preguntas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Running/Paused Exam
  const currentQuestion = examQuestions[currentQuestionIndex]
  const results = getResults()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Simulacro de Examen</h1>
          <p className="text-gray-600">
            Pregunta {currentQuestionIndex + 1} de {examQuestions.length}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-600">Tiempo restante</div>
            <div className={`text-xl font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-blue-600'}`}>
              <Clock className="h-5 w-5 inline mr-1" />
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="flex gap-2">
            {examState === 'running' ? (
              <Button variant="outline" onClick={pauseExam}>
                <Pause className="h-4 w-4 mr-2" />
                Pausar
              </Button>
            ) : (
              <Button onClick={resumeExam}>
                <Play className="h-4 w-4 mr-2" />
                Continuar
              </Button>
            )}
            <Button variant="destructive" onClick={finishExam}>
              Finalizar
            </Button>
          </div>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progreso del examen</span>
            <span>{results.answered}/{examQuestions.length} respondidas</span>
          </div>
          <Progress value={(results.answered / examQuestions.length) * 100} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Navegación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {examQuestions.map((_, index) => {
                const status = getQuestionStatus(index)
                const isCurrent = index === currentQuestionIndex
                
                return (
                  <button
                    key={index}
                    onClick={() => navigateToQuestion(index)}
                    className={`w-8 h-8 rounded text-xs font-medium ${
                      isCurrent ? 'bg-blue-500 text-white' : getQuestionStatusColor(status)
                    }`}
                  >
                    {index + 1}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current Question */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                <CardTitle>Pregunta {currentQuestionIndex + 1}</CardTitle>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">{currentQuestion?.chapter}</Badge>
                <Badge className={
                  currentQuestion?.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  currentQuestion?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }>
                  {currentQuestion?.difficulty === 'easy' ? 'Fácil' :
                   currentQuestion?.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {currentQuestion?.question}
              </h3>
              
              <div className="space-y-3">
                {currentQuestion?.options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedAnswers[currentQuestion.id] === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestion.id] === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedAnswers[currentQuestion.id] === index && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-gray-900">{option}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => navigateToQuestion(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
              >
                Anterior
              </Button>
              
              <Button 
                onClick={() => navigateToQuestion(Math.min(examQuestions.length - 1, currentQuestionIndex + 1))}
                disabled={currentQuestionIndex === examQuestions.length - 1}
              >
                Siguiente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Simulacro

