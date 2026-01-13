import './App.css'
import PricePage from './pages/PricePage'
import { Toaster } from 'sonner'

function App() {
  return <>
    <Toaster richColors position='top-right' />
    <PricePage />
  </>
}

export default App
