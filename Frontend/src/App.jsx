import {Outlet} from "react-router-dom"
import Header from "./components/Header"

function App() {

  return (
   <div className="p-4 m-2">
      <Header />
      <Outlet />
   </div>    
  )
}

export default App
