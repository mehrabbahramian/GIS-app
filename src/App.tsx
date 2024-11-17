import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Router from './Router'

function App() {

  return (
    <BrowserRouter>
      <Routes >
        <Route path='/*' element={<Router/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
