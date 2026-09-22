
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import {Login} from './assets/login.js'
import { Projects } from './assets/projects.js'

function App() {

  return (
    <BrowserRouter>
      <Routes>
      <Route path='/login' element={<Login/>}/>
    <Route path='/projects' element={<Projects/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
