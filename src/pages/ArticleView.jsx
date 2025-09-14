import { useState } from 'react'
import { ArrowLeft, BookOpen, Lightbulb, Target, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

const ArticleView = ({ article, chapter, onBack, onNavigate }) => {
  const [showKeyPoints, setShowKeyPoints] = useState(true)
  const [showExamTips, setShowExamTips] = useState(true)

  if (!article) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Artículo no encontrado</h3>
        <p className="text-gray-600">El artículo solicitado no está disponible.</p>
        <Button onClick={onBack} className="mt-4">
          Volver al Temario
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Artículo {article.number}: {article.title}
          </h1>
          <p className="text-gray-600">{chapter?.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Article Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                Contenido del Artículo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                {article.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return (
                      <h4 key={index} className="font-semibold text-gray-900 mt-4 mb-2">
                        {paragraph.replace(/\*\*/g, '')}
                      </h4>
                    )
                  }
                  if (paragraph.match(/^\d+\./)) {
                    return (
                      <div key={index} className="bg-blue-50 p-3 rounded-lg my-3">
                        <p className="text-blue-900 font-medium">{paragraph}</p>
                      </div>
                    )
                  }
                  return (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Key Points */}
          {article.keyPoints && (
            <Card>
              <CardHeader>
                <CardTitle 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setShowKeyPoints(!showKeyPoints)}
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Puntos Clave
                  </div>
                  <ChevronRight className={`h-4 w-4 transition-transform ${showKeyPoints ? 'rotate-90' : ''}`} />
                </CardTitle>
              </CardHeader>
              {showKeyPoints && (
                <CardContent>
                  <ul className="space-y-2">
                    {article.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              )}
            </Card>
          )}

          {/* Exam Tips */}
          {article.examTips && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle 
                  className="flex items-center justify-between cursor-pointer text-orange-900"
                  onClick={() => setShowExamTips(!showExamTips)}
                >
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    Tips para Examen
                  </div>
                  <ChevronRight className={`h-4 w-4 transition-transform ${showExamTips ? 'rotate-90' : ''}`} />
                </CardTitle>
              </CardHeader>
              {showExamTips && (
                <CardContent>
                  <ul className="space-y-2">
                    {article.examTips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-orange-800 font-medium">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              )}
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Navigation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Navegación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Artículo Anterior
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Artículo Siguiente
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
              <Separator />
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => onNavigate('preguntas')}
              >
                Practicar con Preguntas
              </Button>
            </CardContent>
          </Card>

          {/* Chapter Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Información del Capítulo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">{chapter?.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{chapter?.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    Artículo {article.number}
                  </Badge>
                  <Badge variant="secondary">
                    {chapter?.articles?.length || 0} artículos
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Términos Relacionados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['ICT', 'Operador', 'Usuario', 'Hogar Digital'].map((term) => (
                  <Button 
                    key={term}
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-blue-600 hover:text-blue-800"
                    onClick={() => onNavigate('glosario')}
                  >
                    {term}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tu Progreso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Artículos leídos</span>
                  <span className="font-medium">3/15</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '20%' }} />
                </div>
                <p className="text-xs text-gray-600">
                  ¡Sigue así! Has completado el 20% del temario.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default ArticleView

