
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import { Login } from './assets/login.js'
import { AddProject } from './assets/AddProject.js'
import { Editroject } from './assets/Editroject.js'
import { Projects } from './assets/projects.js'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="AddProject" element={<AddProject />} />
        <Route path="/editProject/:id" element={<Editroject />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
