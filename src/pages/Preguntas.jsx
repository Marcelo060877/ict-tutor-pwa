import { useState, useEffect } from 'react'
import { Clock, CheckCircle, XCircle, ArrowLeft, ArrowRight, RotateCcw, Target, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ictData } from '../data/ictData'

const Preguntas = ({ onNavigate }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [answers, setAnswers] = useState([])
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes per question
  const [isTimerActive, setIsTimerActive] = useState(true)
  const [testCompleted, setTestCompleted] = useState(false)
  const [difficulty, setDifficulty] = useState('all')
  const [chapter, setChapter] = useState('all')

  const questions = ictData.examQuestions.filter(q => {
    const matchesDifficulty = difficulty === 'all' || q.difficulty === difficulty
    const matchesChapter = chapter === 'all' || q.chapter.toLowerCase().includes(chapter.toLowerCase())
    return matchesDifficulty && matchesChapter
  })

  const currentQuestion = questions[currentQuestionIndex]

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeLeft > 0 && !showExplanation) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showExplanation) {
      handleTimeUp()
    }
  }, [timeLeft, isTimerActive, showExplanation])

  const handleTimeUp = () => {
    setIsTimerActive(false)
    setShowExplanation(true)
    setAnswers(prev => [...prev, { 
      questionId: currentQuestion.id, 
      selected: null, 
      correct: currentQuestion.correct,
      timeUp: true 
    }])
  }

  const handleAnswerSelect = (answerIndex) => {
    if (showExplanation) return
    setSelectedAnswer(answerIndex)
  }

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null) return
    
    setIsTimerActive(false)
    setShowExplanation(true)
    
    const isCorrect = selectedAnswer === currentQuestion.correct
    setAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      selected: selectedAnswer,
      correct: currentQuestion.correct,
      isCorrect,
      timeSpent: 180 - timeLeft
    }])
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
      setTimeLeft(180)
      setIsTimerActive(true)
    } else {
      setTestCompleted(true)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
      setTimeLeft(180)
      setIsTimerActive(true)
    }
  }

  const resetTest = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setAnswers([])
    setTimeLeft(180)
    setIsTimerActive(true)
    setTestCompleted(false)
  }

  const getAnswerStyle = (index) => {
    if (!showExplanation) {
      return selectedAnswer === index 
        ? 'border-blue-500 bg-blue-50' 
        : 'border-gray-200 hover:border-gray-300'
    }
    
    if (index === currentQuestion.correct) {
      return 'border-green-500 bg-green-50'
    }
    
    if (selectedAnswer === index && index !== currentQuestion.correct) {
      return 'border-red-500 bg-red-50'
    }
    
    return 'border-gray-200'
  }

  const getAnswerIcon = (index) => {
    if (!showExplanation) return null
    
    if (index === currentQuestion.correct) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    }
    
    if (selectedAnswer === index && index !== currentQuestion.correct) {
      return <XCircle className="h-5 w-5 text-red-500" />
    }
    
    return null
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getResults = () => {
    const correct = answers.filter(a => a.isCorrect).length
    const total = answers.length
    const percentage = Math.round((correct / total) * 100)
    return { correct, total, percentage }
  }

  if (testCompleted) {
    const results = getResults()
    return (
      <div className="space-y-6">
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl">¡Test Completado!</CardTitle>
            <CardDescription>Has terminado el test de preguntas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{results.correct}</div>
                <div className="text-sm text-gray-600">Correctas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{results.total - results.correct}</div>
                <div className="text-sm text-gray-600">Incorrectas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{results.percentage}%</div>
                <div className="text-sm text-gray-600">Puntuación</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progreso</span>
                <span>{results.percentage}%</span>
              </div>
              <Progress value={results.percentage} className="h-3" />
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={resetTest}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Repetir Test
              </Button>
              <Button variant="outline" onClick={() => onNavigate('temario')}>
                Volver al Temario
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay preguntas disponibles</h3>
        <p className="text-gray-600">Ajusta los filtros para ver más preguntas.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Test de Preguntas</h1>
          <p className="text-gray-600">Pon a prueba tus conocimientos del Reglamento ICT</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-600">Tiempo restante</div>
            <div className={`text-lg font-bold ${timeLeft < 30 ? 'text-red-600' : 'text-blue-600'}`}>
              <Clock className="h-4 w-4 inline mr-1" />
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Pregunta {currentQuestionIndex + 1} de {questions.length}</span>
            <span>{answers.filter(a => a.isCorrect).length}/{answers.length} correctas</span>
          </div>
          <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <CardTitle>Pregunta {currentQuestionIndex + 1}</CardTitle>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">{currentQuestion.chapter}</Badge>
              <Badge className={
                currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }>
                {currentQuestion.difficulty === 'easy' ? 'Fácil' :
                 currentQuestion.difficulty === 'medium' ? 'Medio' : 'Difícil'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {currentQuestion.question}
            </h3>
            
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${getAnswerStyle(index)}`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === index ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}>
                        {selectedAnswer === index && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-gray-900">{option}</span>
                    </div>
                    {getAnswerIcon(index)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explanation */}
          {showExplanation && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Lightbulb className="h-5 w-5" />
                  {selectedAnswer === currentQuestion.correct ? '¡Correcto!' : 'Incorrecto'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-800">{currentQuestion.explanation}</p>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            
            {!showExplanation ? (
              <Button 
                onClick={handleConfirmAnswer}
                disabled={selectedAnswer === null}
              >
                Confirmar Respuesta
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                {currentQuestionIndex < questions.length - 1 ? (
                  <>
                    Siguiente
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  'Finalizar Test'
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Preguntas

