import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"

const API_URL = "http://localhost:8000"

export default function AuthorityLogin() {
    const navigate = useNavigate()
    const [isLogin, setIsLogin] = useState(true)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [secretKey, setSecretKey] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (!username || !password) {
            setError("Please fill all fields.")
            return
        }

        setIsLoading(true)

        try {
            if (isLogin) {
                const res = await fetch(`${API_URL}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                })
                const data = await res.json()
                if (!res.ok) {
                    setError(data.detail || "Login failed.")
                } else {
                    localStorage.setItem("authorityAuth", JSON.stringify({
                        username: data.username,
                        isLoggedIn: true,
                        token: data.access_token
                    }))
                    navigate("/authority/dashboard")
                }
            } else {
                if (!secretKey) {
                    setError("Authority secret key is required.")
                    setIsLoading(false)
                    return
                }
                const res = await fetch(`${API_URL}/auth/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password, secret_key: secretKey }),
                })
                const data = await res.json()
                if (!res.ok) {
                    setError(data.detail || "Registration failed.")
                } else {
                    localStorage.setItem("authorityAuth", JSON.stringify({
                        username: data.username,
                        isLoggedIn: true,
                        token: data.access_token
                    }))
                    navigate("/authority/dashboard")
                }
            }
        } catch (err) {
            console.error(err)
            setError("Server error. Please make sure the backend is running.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center px-4 font-sans">
            <div className="w-full max-w-md">
                <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
                    <h1 className="text-3xl font-bold text-foreground mb-2 text-center">Authority Portal</h1>
                    <p className="text-muted-foreground text-center mb-8">
                        Government Officials {isLogin ? "Login" : "Sign Up"}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                        />

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                        />

                        {!isLogin && (
                            <input
                                type="password"
                                value={secretKey}
                                onChange={(e) => setSecretKey(e.target.value)}
                                placeholder="Authority Secret Key"
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                            />
                        )}

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-lg text-sm">{error}</div>
                        )}

                        {isLogin && (
                            <div className="text-xs text-muted-foreground mt-2">
                                * Use admin / admin123 for testing
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            {isLoading
                                ? (isLogin ? "Logging in..." : "Signing up...")
                                : (isLogin ? "Login" : "Sign Up")}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-border flex flex-col gap-3">
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin)
                                setError("")
                                setSecretKey("")
                                setPassword("")
                                setUsername("")
                            }}
                            className="text-primary hover:underline bg-transparent text-sm"
                        >
                            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                        </button>
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
