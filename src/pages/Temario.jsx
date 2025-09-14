import { useState } from 'react'
import { ChevronRight, CheckCircle, Clock, BookOpen, Search, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { ictData } from '../data/ictData'
import ArticleView from './ArticleView'

const Temario = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedChapter, setSelectedChapter] = useState(null)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [readArticles, setReadArticles] = useState(new Set(['art1', 'art2'])) // Mock read articles

  if (selectedArticle) {
    const chapter = ictData.chapters.find(ch => 
      ch.articles.some(art => art.id === selectedArticle)
    )
    const article = chapter?.articles.find(art => art.id === selectedArticle)
    
    return (
      <ArticleView 
        article={article}
        chapter={chapter}
        onBack={() => setSelectedArticle(null)}
        onNavigate={onNavigate}
      />
    )
  }

  const allChapters = [...ictData.chapters, ...ictData.annexes]
  
  const filteredChapters = allChapters.filter(chapter =>
    chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (chapter.articles && chapter.articles.some(article => 
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    )) ||
    (chapter.sections && chapter.sections.some(section =>
      section.title.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  )

  const getChapterProgress = (chapter) => {
    if (chapter.articles) {
      const totalArticles = chapter.articles.length
      const readCount = chapter.articles.filter(art => readArticles.has(art.id)).length
      return Math.round((readCount / totalArticles) * 100)
    }
    if (chapter.sections) {
      // Mock progress for annexes
      return Math.floor(Math.random() * 60) + 20
    }
    return 0
  }

  const getStatusIcon = (item) => {
    if (readArticles.has(item.id)) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    } else {
      return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const totalArticles = ictData.chapters.reduce((acc, ch) => acc + ch.articles.length, 0)
  const completedArticles = readArticles.size
  const overallProgress = Math.round((completedArticles / totalArticles) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Temario</h1>
          <p className="text-gray-600">Explora el contenido del Reglamento ICT</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar en el temario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-80"
          />
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Progreso General del Temario</CardTitle>
          <CardDescription>
            Tu avance en el estudio del Reglamento ICT
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progreso Total</span>
                <span>{overallProgress}% Completado</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{overallProgress}%</div>
                <div className="text-sm text-gray-600">Progreso Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedArticles}</div>
                <div className="text-sm text-gray-600">Artículos Completados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{totalArticles}</div>
                <div className="text-sm text-gray-600">Total Artículos</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chapters List */}
      <div className="space-y-4">
        {filteredChapters.map((chapter) => {
          const progress = getChapterProgress(chapter)
          const items = chapter.articles || chapter.sections || []
          const completedItems = chapter.articles 
            ? chapter.articles.filter(art => readArticles.has(art.id)).length
            : Math.floor(items.length * (progress / 100))

          return (
            <Card key={chapter.id} className="overflow-hidden">
              <CardHeader 
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setSelectedChapter(selectedChapter === chapter.id ? null : chapter.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    <div>
                      <CardTitle className="text-lg">{chapter.title}</CardTitle>
                      <CardDescription>
                        {completedItems} de {items.length} {chapter.articles ? 'artículos' : 'secciones'} completados
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-medium">{progress}%</div>
                      <Progress value={progress} className="w-20" />
                    </div>
                    <ChevronRight 
                      className={`h-5 w-5 text-gray-400 transition-transform ${
                        selectedChapter === chapter.id ? 'rotate-90' : ''
                      }`} 
                    />
                  </div>
                </div>
              </CardHeader>
              
              {selectedChapter === chapter.id && (
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {items.map((item) => {
                      const isCompleted = chapter.articles ? readArticles.has(item.id) : false
                      const itemProgress = isCompleted ? 100 : Math.floor(Math.random() * 80)
                      
                      return (
                        <div 
                          key={item.id}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => {
                            if (chapter.articles) {
                              setSelectedArticle(item.id)
                            }
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            {chapter.articles ? getStatusIcon(item) : (
                              <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                            )}
                            <div>
                              <div className="font-medium text-gray-900">
                                {chapter.articles ? `Art. ${item.number}: ${item.title}` : item.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {isCompleted ? 'Completado' : `${itemProgress}% completado`}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress value={itemProgress} className="w-16" />
                            {chapter.articles && (
                              <Button variant="outline" size="sm">
                                {itemProgress > 0 ? 'Continuar' : 'Comenzar'}
                                <ArrowRight className="h-3 w-3 ml-1" />
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* Next Steps */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Siguiente Recomendación</h3>
              <p className="text-blue-700">Continúa con el Artículo 3: Ámbito de aplicación</p>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setSelectedArticle('art3')}
            >
              Leer Siguiente
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Temario

