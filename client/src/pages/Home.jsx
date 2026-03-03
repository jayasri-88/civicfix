import { Link } from "react-router-dom"
import { BarChart3, MapPin, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import { useIssueStore } from "@/lib/store"

export default function Home() {
    const { issues } = useIssueStore()

    const stats = {
        total: issues.length,
        resolved: issues.filter((i) => i.status === "Resolved").length,
        inProgress: issues.filter((i) => i.status === "In Progress").length,
        submitted: issues.filter((i) => i.status === "Submitted").length,
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 font-sans">
            <Navigation />

            <main className="container mx-auto px-4 py-12">
                {/* Hero Section */}
                <section className="mb-16 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                        CivicFix
                    </h1>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
                        Report infrastructure issues in your village and track their resolution in real-time. Help build a better
                        community.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/report">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                Report an Issue
                            </Button>
                        </Link>
                        <Link to="/track">
                            <Button size="lg" variant="outline">
                                Track Issue
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-16">
                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm mb-1">Total Issues</p>
                                <p className="text-3xl font-bold text-foreground">{stats.total}</p>
                            </div>
                            <BarChart3 className="w-8 h-8 text-primary" />
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm mb-1">Resolved</p>
                                <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-600" />
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm mb-1">In Progress</p>
                                <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
                            </div>
                            <MapPin className="w-8 h-8 text-yellow-600" />
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-muted-foreground text-sm mb-1">Submitted</p>
                                <p className="text-3xl font-bold text-blue-600">{stats.submitted}</p>
                            </div>
                            <Users className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                            <MapPin className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Easy Reporting</h3>
                        <p className="text-muted-foreground">
                            Report infrastructure issues with photos, location details, and category selection.
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                            <TrendingUp className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Real-time Tracking</h3>
                        <p className="text-muted-foreground">
                            Track your issue status from submission to resolution with detailed updates.
                        </p>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                            <Users className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Community Impact</h3>
                        <p className="text-muted-foreground">
                            See how your reports contribute to improving village infrastructure.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    )
}
