import { useState } from 'react'
import { Search, BookOpen, ExternalLink, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ictData } from '../data/ictData'

const Glosario = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTerm, setSelectedTerm] = useState(null)

  const glossaryTerms = Object.values(ictData.glossary)

  const categories = [
    { id: 'all', name: 'Todos', count: glossaryTerms.length },
    { id: 'general', name: 'General', count: glossaryTerms.filter(t => t.category === 'general').length },
    { id: 'recintos', name: 'Recintos', count: glossaryTerms.filter(t => t.category === 'recintos').length },
    { id: 'conexiones', name: 'Conexiones', count: glossaryTerms.filter(t => t.category === 'conexiones').length },
    { id: 'servicios', name: 'Servicios', count: glossaryTerms.filter(t => t.category === 'servicios').length }
  ]

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  const getCategoryColor = (category) => {
    switch (category) {
      case 'general': return 'bg-blue-100 text-blue-800'
      case 'recintos': return 'bg-green-100 text-green-800'
      case 'conexiones': return 'bg-purple-100 text-purple-800'
      case 'servicios': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const scrollToLetter = (letter) => {
    const element = document.getElementById(`term-${letter}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Group terms by first letter
  const termsByLetter = filteredTerms.reduce((acc, term) => {
    const firstLetter = term.term[0].toUpperCase()
    if (!acc[firstLetter]) {
      acc[firstLetter] = []
    }
    acc[firstLetter].push(term)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Glosario ICT</h1>
        <p className="text-gray-600">Términos y definiciones del Reglamento de Telecomunicaciones</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar términos, definiciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>
      </div>

      {/* Alphabet Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {alphabet.map((letter) => {
              const hasTerms = filteredTerms.some(term => 
                term.term.toUpperCase().startsWith(letter)
              )
              return (
                <Button
                  key={letter}
                  variant="ghost"
                  size="sm"
                  className={`w-8 h-8 p-0 ${hasTerms ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-300'}`}
                  disabled={!hasTerms}
                  onClick={() => scrollToLetter(letter)}
                >
                  {letter}
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        {filteredTerms.length} término{filteredTerms.length !== 1 ? 's' : ''} encontrado{filteredTerms.length !== 1 ? 's' : ''}
      </div>

      {/* Terms List */}
      <div className="space-y-6">
        {Object.keys(termsByLetter).sort().map((letter) => (
          <div key={letter} id={`term-${letter}`}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b pb-2">{letter}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {termsByLetter[letter].map((term) => (
                <Card 
                  key={term.term} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedTerm(selectedTerm === term.term ? null : term.term)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg text-blue-900">{term.term}</CardTitle>
                        <CardDescription className="font-medium">{term.fullName}</CardDescription>
                      </div>
                      <Badge className={getCategoryColor(term.category)}>
                        {categories.find(c => c.id === term.category)?.name}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-3">{term.definition}</p>
                    
                    {selectedTerm === term.term && (
                      <div className="space-y-4 pt-4 border-t">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Referencia</h4>
                          <Badge variant="outline">{term.chapter}</Badge>
                        </div>
                        
                        {term.relatedTerms && term.relatedTerms.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Términos relacionados</h4>
                            <div className="flex flex-wrap gap-2">
                              {term.relatedTerms.map((relatedTerm) => (
                                <Badge 
                                  key={relatedTerm} 
                                  variant="secondary" 
                                  className="text-xs cursor-pointer hover:bg-gray-200"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSearchTerm(relatedTerm)
                                    setSelectedTerm(null)
                                  }}
                                >
                                  {relatedTerm}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              onNavigate('temario')
                            }}
                          >
                            <BookOpen className="h-4 w-4 mr-2" />
                            Ver en Temario
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              onNavigate('preguntas')
                            }}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Practicar
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron términos</h3>
            <p className="text-gray-600">
              Intenta con otros términos de búsqueda o cambia los filtros
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
            >
              Limpiar filtros
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Glosario

