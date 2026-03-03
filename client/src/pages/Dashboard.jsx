import { useMemo, useState } from "react"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Navigation from "@/components/navigation"
import { useIssueStore } from "@/lib/store"
import { TrendingUp, AlertCircle, CheckCircle, Clock, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"


export default function Dashboard() {
    const { issues } = useIssueStore()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [selectedStatus, setSelectedStatus] = useState("All")
    const [selectedVillage, setSelectedVillage] = useState("All")
    const [selectedPriority, setSelectedPriority] = useState("All")

    const filteredIssues = useMemo(() => {
        return issues.filter((issue) => {
            const matchesSearch =
                searchQuery === "" ||
                issue.trackingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                issue.description.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesCategory = selectedCategory === "All" || issue.category === selectedCategory
            const matchesStatus = selectedStatus === "All" || issue.status === selectedStatus
            const matchesVillage = selectedVillage === "All" || issue.village === selectedVillage
            const matchesPriority = selectedPriority === "All" || issue.priority === selectedPriority

            return matchesSearch && matchesCategory && matchesStatus && matchesVillage && matchesPriority
        })
    }, [issues, searchQuery, selectedCategory, selectedStatus, selectedVillage, selectedPriority])

    const stats = useMemo(() => {
        const categoryCount = {}
        const statusCount = {}
        const villageCount = {}

        filteredIssues.forEach((issue) => {
            categoryCount[issue.category] = (categoryCount[issue.category] || 0) + 1
            statusCount[issue.status] = (statusCount[issue.status] || 0) + 1
            villageCount[issue.village] = (villageCount[issue.village] || 0) + 1
        })

        return {
            categoryCount,
            statusCount,
            villageCount,
            total: filteredIssues.length,
            resolved: filteredIssues.filter((i) => i.status === "Resolved").length,
            inProgress: filteredIssues.filter((i) => i.status === "In Progress").length,
            submitted: filteredIssues.filter((i) => i.status === "Submitted").length,
        }
    }, [filteredIssues])

    const categories = ["All", ...new Set(issues.map((i) => i.category))]
    const statuses = ["All", ...new Set(issues.map((i) => i.status))]
    const villages = ["All", ...new Set(issues.map((i) => i.village))]
    const priorities = ["All", ...new Set(issues.map((i) => i.priority))]

    const categoryData = Object.entries(stats.categoryCount).map(([name, value]) => ({
        name,
        value,
    }))

    const statusData = Object.entries(stats.statusCount).map(([name, value]) => ({
        name,
        value,
    }))

    const villageData = Object.entries(stats.villageCount).map(([name, value]) => ({
        name,
        value,
    }))

    const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"]

    const resetFilters = () => {
        setSearchQuery("")
        setSelectedCategory("All")
        setSelectedStatus("All")
        setSelectedVillage("All")
        setSelectedPriority("All")
    }

    const hasActiveFilters =
        searchQuery !== "" ||
        selectedCategory !== "All" ||
        selectedStatus !== "All" ||
        selectedVillage !== "All" ||
        selectedPriority !== "All"

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navigation />

            <main className="container mx-auto px-4 py-12">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Public Dashboard</h1>
                    <p className="text-muted-foreground">
                        Real-time statistics on village infrastructure issues and their resolution status.
                    </p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm mb-1">Total Issues</p>
                                <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm mb-1">Resolved</p>
                                <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm mb-1">In Progress</p>
                                <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-600" />
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm mb-1">Resolution Rate</p>
                                <p className="text-3xl font-bold text-purple-600">
                                    {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
                                </p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Search & Filter</h2>

                    {/* Search Bar */}
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by tracking ID, title, or description..."
                                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                            />
                        </div>
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                            >
                                {statuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Village</label>
                            <select
                                value={selectedVillage}
                                onChange={(e) => setSelectedVillage(e.target.value)}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                            >
                                {villages.map((village) => (
                                    <option key={village} value={village}>
                                        {village}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Priority</label>
                            <select
                                value={selectedPriority}
                                onChange={(e) => setSelectedPriority(e.target.value)}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                            >
                                {priorities.map((priority) => (
                                    <option key={priority} value={priority}>
                                        {priority}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Reset Button */}
                    {hasActiveFilters && (
                        <div className="flex justify-end">
                            <Button
                                onClick={resetFilters}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2 bg-transparent"
                            >
                                <X className="w-4 h-4" />
                                Reset Filters
                            </Button>
                        </div>
                    )}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Category Distribution */}
                    <div className="bg-card border border-border rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-foreground mb-4">Issues by Category</h2>
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, value }) => `${name}: ${value}`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {categoryData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-muted-foreground text-center py-8">No data available</p>
                        )}
                    </div>

                    {/* Status Distribution */}
                    <div className="bg-card border border-border rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-foreground mb-4">Issues by Status</h2>
                        {statusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={statusData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="name" stroke="#6b7280" />
                                    <YAxis stroke="#6b7280" />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-muted-foreground text-center py-8">No data available</p>
                        )}
                    </div>
                </div>

                {/* Village Breakdown */}
                <div className="bg-card border border-border rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-semibold text-foreground mb-4">Issues by Village</h2>
                    {villageData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={villageData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis type="number" stroke="#6b7280" />
                                <YAxis dataKey="name" type="category" stroke="#6b7280" width={150} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">No data available</p>
                    )}
                </div>

                {/* Recent Issues */}
                <div className="bg-card border border-border rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                        {hasActiveFilters ? "Filtered Issues" : "Recent Issues"}
                    </h2>
                    {filteredIssues.length > 0 ? (
                        <div className="space-y-3">
                            {filteredIssues.slice(0, 10).map((issue) => (
                                <div
                                    key={issue.id}
                                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover:bg-secondary/70 transition"
                                >
                                    <div className="flex-1">
                                        <p className="font-semibold text-foreground">{issue.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {issue.trackingId} • {issue.village} • {issue.category}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
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
                                        <div
                                            className={`px-2 py-1 rounded text-xs font-medium ${issue.priority === "High"
                                                ? "bg-red-100 text-red-800"
                                                : issue.priority === "Medium"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-green-100 text-green-800"
                                                }`}
                                        >
                                            {issue.priority}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground">No issues found matching your filters.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
