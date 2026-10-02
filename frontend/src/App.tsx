
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import { Login } from './assets/login.js'
import { AddProject } from './assets/AddProject.js'
import { Editroject } from './assets/Editroject.js'
import { Projects } from './assets/projects.js'
import { ProjectDetails } from './assets/ProjectDetails.js'
import { DeletePR } from './assets/ProjectDeletion.js'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="AddProject" element={<AddProject />} />
        <Route path="/editProject/:id" element={<Editroject />} />
        <Route path="/ProjectDetails/:id" element={<ProjectDetails />} />
        <Route path='DeletePR/:id' element={<DeletePR/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
