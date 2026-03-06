import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { LogOut, Edit2, AlertCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIssueStore } from "@/lib/store"
import IssueManagementModal from "@/components/issue-management"

export default function AuthorityDashboard() {
    const navigate = useNavigate()
    const { issues, updateIssue } = useIssueStore()
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [selectedIssue, setSelectedIssue] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [filterStatus, setFilterStatus] = useState("All")
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const auth = localStorage.getItem("authorityAuth")
        if (!auth) {
            navigate("/authority")
        } else {
            setIsAuthenticated(true)
        }
    }, [navigate])

    const handleLogout = () => {
        localStorage.removeItem("authorityAuth")
        navigate("/authority")
    }

    const handleEditIssue = (issue) => {
        setSelectedIssue(issue)
        setIsModalOpen(true)
    }

    const handleSaveIssue = (updates) => {
        if (selectedIssue) {
            updateIssue(selectedIssue.id, updates)
            setIsModalOpen(false)
            setSelectedIssue(null)
        }
    }

    const filteredIssues = issues.filter((issue) => {
        const matchesStatus = filterStatus === "All" || issue.status === filterStatus
        const matchesSearch =
            searchQuery === "" ||
            issue.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            issue.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
            issue.reporterName.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesStatus && matchesSearch
    })

    if (!isAuthenticated) {
        return null
    }

    return (
        <div className="min-h-screen bg-background font-sans">
            {/* Header */}
            <div className="bg-card border-b border-border sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-primary">Authority Dashboard</h1>
                    <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2 bg-transparent">
                        <LogOut className="w-4 h-4" />
                        Logout
                    </Button>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-card border border-border rounded-lg p-4">
                        <p className="text-muted-foreground text-sm mb-1">Total Issues</p>
                        <p className="text-2xl font-bold text-foreground">{issues.length}</p>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4">
                        <p className="text-muted-foreground text-sm mb-1">Pending Review</p>
                        <p className="text-2xl font-bold text-blue-600">{issues.filter((i) => i.status === "Submitted").length}</p>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4">
                        <p className="text-muted-foreground text-sm mb-1">In Progress</p>
                        <p className="text-2xl font-bold text-yellow-600">
                            {issues.filter((i) => i.status === "In Progress").length}
                        </p>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4">
                        <p className="text-muted-foreground text-sm mb-1">Resolved</p>
                        <p className="text-2xl font-bold text-green-600">{issues.filter((i) => i.status === "Resolved").length}</p>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by tracking ID, title, village, or reporter name..."
                            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                        />
                    </div>
                </div>

                {/* Filter */}
                <div className="mb-6 flex flex-wrap gap-2">
                    {["All", "Submitted", "Under Review", "In Progress", "Resolved", "Rejected"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg border transition ${filterStatus === status
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card border-border hover:border-primary"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Issues Table */}
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-secondary/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Tracking ID</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Title</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Category</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Priority</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Village</th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredIssues.map((issue) => (
                                    <tr key={issue.id} className="border-b border-border hover:bg-secondary/30 transition">
                                        <td className="px-6 py-4 text-sm font-mono text-primary">{issue.trackingId}</td>
                                        <td className="px-6 py-4 text-sm text-foreground font-medium">{issue.title}</td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">{issue.category}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${issue.status === "Resolved"
                                                    ? "bg-green-100 text-green-800"
                                                    : issue.status === "In Progress"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : issue.status === "Submitted"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-gray-100 text-gray-800"
                                                    }`}
                                            >
                                                {issue.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${issue.priority === "High"
                                                    ? "bg-red-100 text-red-800"
                                                    : issue.priority === "Medium"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-green-100 text-green-800"
                                                    }`}
                                            >
                                                {issue.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">{issue.village}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <button
                                                onClick={() => handleEditIssue(issue)}
                                                className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition bg-transparent"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredIssues.length === 0 && (
                        <div className="text-center py-12">
                            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground">No issues found with the selected filter.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Modal */}
            {isModalOpen && selectedIssue && (
                <IssueManagementModal
                    issue={selectedIssue}
                    onClose={() => {
                        setIsModalOpen(false)
                        setSelectedIssue(null)
                    }}
                    onSave={handleSaveIssue}
                />
            )}
        </div>
    )
}
