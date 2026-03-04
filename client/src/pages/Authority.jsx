import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

const DEMO_CREDENTIALS = {
    username: "admin",
    password: "admin123",
}

export default function AuthorityLogin() {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        setError("")
        setIsLoading(true)

        // Simulate login delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
            // Store auth state in localStorage
            localStorage.setItem("authorityAuth", JSON.stringify({ username, isLoggedIn: true }))
            navigate("/authority/dashboard")
        } else {
            setError("Invalid username or password. Try admin/admin123")
        }

        setIsLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center px-4 font-sans">
            <div className="w-full max-w-md">
                <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
                    <h1 className="text-3xl font-bold text-foreground mb-2 text-center">Authority Portal</h1>
                    <p className="text-muted-foreground text-center mb-8">Government Officials Login</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg text-sm">{error}</div>
                        )}

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                            <p>admin</p>
                            <p>admin123</p>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-border">
                        <p className="text-center text-sm text-muted-foreground">
                            Not an authority?{" "}
                            <button onClick={() => navigate("/")} className="text-primary hover:underline bg-transparent">
                                Go to home
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
