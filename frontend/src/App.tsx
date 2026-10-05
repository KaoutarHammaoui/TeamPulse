
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import { Login } from './assets/login.js'
import { AddProject } from './assets/AddProject.js'
import { Editroject } from './assets/Editroject.js'
import { Projects } from './assets/projects.js'
import { ProjectDetails } from './assets/ProjectDetails.js'
import { DeletePR } from './assets/ProjectDeletion.js'
import { ProjectTasks } from './assets/ProjectTasks.js'
import { AddTask } from './assets/AddTask.js'
import { EditTask } from './assets/editTask.js'
import { DEleteTask } from './assets/delete.js'

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
        <Route path="DeletePR/:id" element={<DeletePR />} />
        <Route path="ProjectTasks/:id" element={<ProjectTasks />} />
        <Route path="/AddTask/:id" element={<AddTask />} />
        <Route path='/editTask/:id' element={<EditTask />} />
        <Route path='/deleteTask/:id' element={<DEleteTask/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
