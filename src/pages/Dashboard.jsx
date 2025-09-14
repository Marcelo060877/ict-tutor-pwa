import { useState, useEffect } from 'react'
import { TrendingUp, Clock, Target, BookOpen, Brain, Calendar, Award, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { adaptiveLearning } from '../utils/adaptiveLearning'

const Dashboard = ({ onNavigate }) => {
  const [userStats, setUserStats] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [studyPlan, setStudyPlan] = useState(null)

  useEffect(() => {
    // Cargar estadísticas del usuario
    const stats = adaptiveLearning.getUserStats()
    setUserStats(stats)

    // Generar recomendaciones
    const recs = adaptiveLearning.generateRecommendations()
    setRecommendations(recs)

    // Generar plan de estudio si no existe
    if (!studyPlan) {
      const plan = adaptiveLearning.generateStudyPlan()
      setStudyPlan(plan)
    }
  }, [])

  const handleRecommendationAction = (action, data) => {
    switch (action) {
      case 'study_weak_topics':
        onNavigate('temario')
        break
      case 'study_chapter':
        onNavigate('temario')
        break
      case 'take_exam':
        onNavigate('simulacro')
        break
      case 'intensive_review':
        onNavigate('preguntas')
        break
      default:
        break
    }
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelText = (level) => {
    switch (level) {
      case 'beginner': return 'Principiante'
      case 'intermediate': return 'Intermedio'
      case 'advanced': return 'Avanzado'
      default: return 'Sin clasificar'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50'
      case 'high': return 'border-orange-500 bg-orange-50'
      case 'medium': return 'border-yellow-500 bg-yellow-50'
      case 'low': return 'border-blue-500 bg-blue-50'
      default: return 'border-gray-500 bg-gray-50'
    }
  }

  if (!userStats) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Tu progreso en el estudio del Reglamento ICT</p>
      </div>

      {/* User Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nivel Actual</p>
                <Badge className={getLevelColor(userStats.level)}>
                  {getLevelText(userStats.level)}
                </Badge>
              </div>
              <Award className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Precisión</p>
                <p className="text-2xl font-bold text-green-600">{userStats.accuracy}%</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tiempo de Estudio</p>
                <p className="text-2xl font-bold text-blue-600">{userStats.studyTime}h</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Racha de Estudio</p>
                <p className="text-2xl font-bold text-orange-600">{userStats.streakDays} días</p>
              </div>
              <Flame className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Recomendaciones Personalizadas
            </CardTitle>
            <CardDescription>
              Basadas en tu progreso y áreas de mejora
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendations.slice(0, 3).map((rec, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${getPriorityColor(rec.priority)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleRecommendationAction(rec.action, rec)}
                    className="ml-4"
                  >
                    Empezar
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Chapter Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Progreso por Capítulos
          </CardTitle>
          <CardDescription>
            Tu dominio de cada sección del reglamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(userStats.chapterProgress).map(([chapter, progress]) => (
            <div key={chapter} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{chapter}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {progress.correctAnswers}/{progress.questionsAnswered}
                  </span>
                  <Badge variant="outline">{progress.mastery}%</Badge>
                </div>
              </div>
              <Progress value={progress.mastery} className="h-2" />
            </div>
          ))}
          
          {Object.keys(userStats.chapterProgress).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Comienza a estudiar para ver tu progreso aquí</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acceso Rápido</CardTitle>
          <CardDescription>
            Continúa donde lo dejaste o explora nuevas secciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => onNavigate('temario')}
            >
              <BookOpen className="h-6 w-6" />
              <span className="text-sm">Continuar Temario</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => onNavigate('preguntas')}
            >
              <Brain className="h-6 w-6" />
              <span className="text-sm">Practicar Preguntas</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => onNavigate('glosario')}
            >
              <Target className="h-6 w-6" />
              <span className="text-sm">Consultar Glosario</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
              onClick={() => onNavigate('simulacro')}
            >
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">Simulacro Examen</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Study Plan Preview */}
      {studyPlan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Plan de Estudio Personalizado
            </CardTitle>
            <CardDescription>
              Tu plan de {studyPlan.totalDays} días para dominar el ICT
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{studyPlan.totalDays}</div>
                  <div className="text-sm text-blue-800">Días de estudio</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{studyPlan.focusAreas.length}</div>
                  <div className="text-sm text-green-800">Áreas de enfoque</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{studyPlan.weeklyMilestones.length}</div>
                  <div className="text-sm text-purple-800">Hitos semanales</div>
                </div>
              </div>

              {studyPlan.dailyGoals.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Objetivo de Hoy:</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-medium">{studyPlan.dailyGoals[0].focusArea}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      {studyPlan.dailyGoals[0].activities.map(activity => activity.title).join(' • ')}
                    </div>
                  </div>
                </div>
              )}

              <Button className="w-full" onClick={() => onNavigate('temario')}>
                Comenzar Plan de Estudio
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weak Areas Alert */}
      {userStats.weakTopics.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-orange-800">Áreas que Necesitan Atención</CardTitle>
            <CardDescription className="text-orange-700">
              Estos temas requieren más práctica para mejorar tu rendimiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {userStats.weakTopics.map((topic, index) => (
                <Badge key={index} variant="outline" className="border-orange-300 text-orange-800">
                  {topic}
                </Badge>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="border-orange-300 text-orange-800 hover:bg-orange-100"
              onClick={() => onNavigate('preguntas')}
            >
              Practicar Áreas Débiles
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Dashboard

