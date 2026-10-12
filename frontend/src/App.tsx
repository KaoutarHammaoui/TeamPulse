
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
import { UpdateRole } from './assets/UpdateRole.js'
import { GetUsers } from './assets/Users.js'
import { Logout } from './assets/logout.js'
import { ProtectedRoute } from './assets/ProtectedRoutes.js'
import { Register } from './assets/Register.js'

function App() {

  return (
    <BrowserRouter>
      <div className="app-frame">
        <Routes>
        <Route path="/login" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path='/register' element={<Register/>}/>
        <Route path="/projects" element={<ProtectedRoute> <Projects /> </ProtectedRoute>} />
        <Route path="AddProject" element={<ProtectedRoute> <AddProject /></ProtectedRoute>} />
        <Route path="/editProject/:id" element={<ProtectedRoute> <Editroject /></ProtectedRoute>} />
        <Route path="/ProjectDetails/:id" element={ <ProtectedRoute>  <ProjectDetails /> </ProtectedRoute> } />
        <Route path="DeletePR/:id" element={<ProtectedRoute>  <DeletePR /> </ProtectedRoute>} />
        <Route path="ProjectTasks/:id" element={<ProtectedRoute> <ProjectTasks /> </ProtectedRoute>} />
        <Route path="/AddTask/:id" element={<ProtectedRoute> <AddTask /> </ProtectedRoute>} />
        <Route path='/editTask/:id' element={<ProtectedRoute> <EditTask /> </ProtectedRoute>} />
        <Route path='/deleteTask/:id' element={<ProtectedRoute> <DEleteTask /> </ProtectedRoute>} />
        <Route path='/Users' element={<ProtectedRoute> <GetUsers /> </ProtectedRoute>} />
        <Route path='/UpdateRole/:id' element={<ProtectedRoute> <UpdateRole /> </ProtectedRoute>} />
        <Route path='/logout' element={<ProtectedRoute> <Logout /></ProtectedRoute>} />
        </Routes>
        <footer className="site-footer">
          <span>Made by</span>
          <a href="https://github.com/defaltastra" target="_blank" rel="noreferrer">defaltastra</a>
          <span className="footer-dot">and</span>
          <a href="https://github.com/KaoutarHammaoui" target="_blank" rel="noreferrer">KaoutarHammaoui</a>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App
