import { useState } from 'react'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Temario from './pages/Temario'
import ArticleView from './pages/ArticleView'
import Preguntas from './pages/Preguntas'
import Glosario from './pages/Glosario'
import Simulacro from './pages/Simulacro'
import PWAInstallPrompt from './components/PWAInstallPrompt'
import OfflineIndicator from './components/OfflineIndicator'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [selectedArticle, setSelectedArticle] = useState(null)

  const handleNavigate = (page, data = null) => {
    setCurrentPage(page)
    if (page === 'article' && data) {
      setSelectedArticle(data)
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />
      case 'temario':
        return <Temario onNavigate={handleNavigate} />
      case 'article':
        return <ArticleView article={selectedArticle} onNavigate={handleNavigate} />
      case 'preguntas':
        return <Preguntas onNavigate={handleNavigate} />
      case 'glosario':
        return <Glosario onNavigate={handleNavigate} />
      case 'simulacro':
        return <Simulacro onNavigate={handleNavigate} />
      default:
        return <Dashboard onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Layout currentPage={currentPage} onNavigate={handleNavigate}>
        {renderPage()}
      </Layout>
      
      {/* Componentes PWA */}
      <PWAInstallPrompt />
      <OfflineIndicator />
    </div>
  )
}

export default App

