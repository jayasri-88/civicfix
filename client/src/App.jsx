import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home" 
import Report from "./pages/Report"
import Dashboard from "./pages/Dashboard"
import {Toaster} from "sonner"

function App() {
  

  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<Report />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
    </>
  )
}

export default App
