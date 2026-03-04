import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Report from "./pages/Report"
import Track from "./pages/Track"
import Dashboard from "./pages/Dashboard"
import Authority from "./pages/Authority"
import AuthorityDashboard from "./pages/AuthorityDashboard"
import { Toaster } from "sonner"
import { useIssueStore } from "./lib/store"

function App() {
  const fetchIssues = useIssueStore((state) => state.fetchIssues)

  useEffect(() => {
    fetchIssues()
  }, [fetchIssues])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<Report />} />
        <Route path="/track" element={<Track />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/authority" element={<Authority />} />
        <Route path="/authority/dashboard" element={<AuthorityDashboard />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  )
}

export default App
