import './App.css'
import PricePage from './pages/PricePage'
import { Toaster } from 'sonner'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import AdminPage from './pages/AdminPage'
import { VehicleProvider } from './context/VehicleContext'


function App() {
  return <>
    <Toaster richColors position='top-right' />
    <VehicleProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<PricePage />} />
          <Route path='/admin-page' element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </VehicleProvider>
  </>
}

export default App
