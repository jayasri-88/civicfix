import { useState, useMemo } from "react"
import { Search, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import { useIssueStore } from "@/lib/store"

const STATUS_COLORS = {
    Submitted: "bg-blue-100 text-blue-800 border-blue-300",
    "Under Review": "bg-purple-100 text-purple-800 border-purple-300",
    "In Progress": "bg-yellow-100 text-yellow-800 border-yellow-300",
    Resolved: "bg-green-100 text-green-800 border-green-300",
    Rejected: "bg-red-100 text-red-800 border-red-300",
}

const STATUS_ICONS = {
    Submitted: AlertCircle,
    "Under Review": Clock,
    "In Progress": Clock,
    Resolved: CheckCircle,
    Rejected: AlertCircle,
}

export default function TrackIssue() {
    const { issues } = useIssueStore()
    const [trackingId, setTrackingId] = useState("")
    const [issue, setIssue] = useState(null)
    const [searched, setSearched] = useState(false)

    const allIssues = useMemo(() => {
        return [...issues].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }, [issues])

    const handleSearch = (e) => {
        e.preventDefault()
        if (trackingId.trim()) {
            const foundIssue = issues.find((i) => i.trackingId === trackingId.toUpperCase())
            setIssue(foundIssue)
            setSearched(true)
        }
    }

    const handleClearSearch = () => {
        setTrackingId("")
        setIssue(null)
        setSearched(false)
    }

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navigation />

            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Track Your Issue</h1>
                    <p className="text-muted-foreground mb-8">Enter your tracking ID to see the status of your reported issue.</p>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="mb-8">
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={trackingId}
                                    onChange={(e) => setTrackingId(e.target.value)}
                                    placeholder="Enter tracking ID (e.g., VIF-2025-001)"
                                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                                />
                            </div>
                            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                Search
                            </Button>
                            {searched && (
                                <Button type="button" onClick={handleClearSearch} variant="outline">
                                    Clear
                                </Button>
                            )}
                        </div>
                    </form>

                    {/* Results */}
                    {searched && !issue && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-8">
                            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                            <p className="text-red-800 font-semibold">Issue not found</p>
                            <p className="text-red-600 text-sm mt-1">Please check your tracking ID and try again.</p>
                        </div>
                    )}

                    {issue && (
                        <div className="space-y-6 mb-12">
                            {/* Issue Header */}
                            <div className="bg-card border border-border rounded-lg p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Tracking ID</p>
                                        <p className="text-2xl font-bold text-foreground">{issue.trackingId}</p>
                                    </div>
                                    <div
                                        className={`px-4 py-2 rounded-full border ${STATUS_COLORS[issue.status]}`}
                                    >
                                        {issue.status}
                                    </div>
                                </div>
                                <h2 className="text-xl font-semibold text-foreground mb-2">{issue.title}</h2>
                                <p className="text-muted-foreground">{issue.description}</p>
                            </div>

                            {/* Issue Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-card border border-border rounded-lg p-4">
                                    <p className="text-sm text-muted-foreground mb-1">Category</p>
                                    <p className="font-semibold text-foreground">{issue.category}</p>
                                </div>
                                <div className="bg-card border border-border rounded-lg p-4">
                                    <p className="text-sm text-muted-foreground mb-1">Priority</p>
                                    <p className="font-semibold text-foreground">{issue.priority}</p>
                                </div>
                                <div className="bg-card border border-border rounded-lg p-4">
                                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                                    <p className="font-semibold text-foreground">{issue.location}</p>
                                </div>
                                <div className="bg-card border border-border rounded-lg p-4">
                                    <p className="text-sm text-muted-foreground mb-1">Village</p>
                                    <p className="font-semibold text-foreground">{issue.village}</p>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="bg-card border border-border rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4">Status Timeline</h3>
                                <div className="space-y-4">
                                    {issue.timeline.map((entry, idx) => {
                                        const Icon = STATUS_ICONS[entry.status] || Clock
                                        return (
                                            <div key={idx} className="flex gap-4">
                                                <div className="flex flex-col items-center">
                                                    <Icon className="w-6 h-6 text-primary" />
                                                    {idx < issue.timeline.length - 1 && <div className="w-0.5 h-12 bg-border mt-2" />}
                                                </div>
                                                <div className="pb-4">
                                                    <p className="font-semibold text-foreground">{entry.status}</p>
                                                    <p className="text-sm text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</p>
                                                    {entry.remarks && <p className="text-sm text-foreground mt-1">{entry.remarks}</p>}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Images */}
                            {issue.images && issue.images.length > 0 && (
                                <div className="bg-card border border-border rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-foreground mb-4">Attached Images</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {issue.images.map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img || "/placeholder.svg"}
                                                alt={`Issue ${idx + 1}`}
                                                className="w-full h-40 object-cover rounded-lg"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Remarks */}
                            {issue.remarks && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-blue-600 font-semibold mb-1">Latest Remarks</p>
                                    <p className="text-blue-800">{issue.remarks}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {!searched && (
                        <div className="bg-card border border-border rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-foreground mb-4">Browse All Issues</h2>
                            <div className="space-y-3">
                                {allIssues.length > 0 ? (
                                    allIssues.map((issue) => (
                                        <button
                                            key={issue.id}
                                            onClick={() => {
                                                setTrackingId(issue.trackingId)
                                                setIssue(issue)
                                                setSearched(true)
                                            }}
                                            className="w-full text-left flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition"
                                        >
                                            <div className="flex-1">
                                                <p className="font-semibold text-foreground">{issue.title}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {issue.trackingId} • {issue.village} • {issue.category}
                                                </p>
                                            </div>
                                            <div
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${issue.status === "Resolved"
                                                    ? "bg-green-100 text-green-800"
                                                    : issue.status === "In Progress"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : issue.status === "Submitted"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-purple-100 text-purple-800"
                                                    }`}
                                            >
                                                {issue.status}
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground text-center py-8">No issues available yet.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
