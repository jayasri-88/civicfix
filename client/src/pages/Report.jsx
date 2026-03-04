import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import { useIssueStore } from "@/lib/store"

const CATEGORIES = [
    { id: "roads", label: "Roads", icon: "🛣️" },
    { id: "water", label: "Water Supply", icon: "💧" },
    { id: "electricity", label: "Electricity", icon: "⚡" },
    { id: "sanitation", label: "Sanitation", icon: "🚽" },
    { id: "drainage", label: "Drainage", icon: "🌊" },
    { id: "other", label: "Other", icon: "📋" },
]

export default function ReportIssue() {
    const navigate = useNavigate()
    const { addIssue } = useIssueStore()
    const [formData, setFormData] = useState({
        category: "",
        title: "",
        description: "",
        location: "",
        village: "",
        reporterName: "",
        reporterPhone: "",
    })
    const [images, setImages] = useState([]) 
    const [imageFiles, setImageFiles] = useState([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleImageUpload = (e) => {
        const files = e.target.files
        if (files) {
            Array.from(files).forEach((file) => {
                setImageFiles((prev) => [...prev, file])
                const reader = new FileReader()
                reader.onload = (event) => {
                    if (event.target?.result) {
                        setImages((prev) => [...prev, event.target.result])
                    }
                }
                reader.readAsDataURL(file)
            })
        }
    }

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
        setImageFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.category || !formData.title || !formData.reporterName || !formData.reporterPhone) {
            alert("Please fill in all required fields")
            return
        }

        setIsSubmitting(true)

        try {
            const data = new FormData()
            data.append("title", formData.title)
            data.append("description", formData.description)
            data.append("location", formData.location)

            if (imageFiles.length > 0) {
                // Submit the first image for now since endpoints expect `image: UploadFile = File(...)`
                data.append("image", imageFiles[0])
            } else {
                alert("Please upload at least one image")
                setIsSubmitting(false)
                return
            }

            const newIssue = await addIssue(data)

            setTimeout(() => {
                navigate("/track")
            }, 1000)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-background font-sans">
            <Navigation />

            <main className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Report an Issue</h1>
                    <p className="text-muted-foreground mb-8">
                        Help us improve village infrastructure by reporting issues you encounter.
                    </p>

                    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-8 space-y-6">
                        {/* Category Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-3">
                                Issue Category <span className="text-red-500">*</span>
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setFormData((prev) => ({ ...prev, category: cat.id }))}
                                        className={`p-4 rounded-lg border-2 transition text-center ${formData.category === cat.id
                                            ? "border-primary bg-primary/10"
                                            : "border-border hover:border-primary/50"
                                            }`}
                                    >
                                        <div className="text-2xl mb-2">{cat.icon}</div>
                                        <div className="text-sm font-medium">{cat.label}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">
                                Issue Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Brief title of the issue"
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Detailed description of the issue"
                                rows={4}
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="Street name, landmark, or address"
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        {/* Village */}
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">Village Name</label>
                            <input
                                type="text"
                                name="village"
                                value={formData.village}
                                onChange={handleInputChange}
                                placeholder="Your village name"
                                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        {/* Images */}
                        <div>
                            <label className="block text-sm font-semibold text-foreground mb-2">Upload Photos</label>
                            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                <p className="text-sm text-muted-foreground mb-2">Drag and drop images or click to select</p>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload">
                                    <Button type="button" variant="outline" size="sm" asChild>
                                        <span className="cursor-pointer">Select Images</span>
                                    </Button>
                                </label>
                            </div>

                            {images.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="relative">
                                            <img
                                                src={img || "/placeholder.svg"}
                                                alt={`Upload ${idx + 1}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Reporter Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    Your Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="reporterName"
                                    value={formData.reporterName}
                                    onChange={handleInputChange}
                                    placeholder="Full name"
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="reporterPhone"
                                    value={formData.reporterPhone}
                                    onChange={handleInputChange}
                                    placeholder="10-digit phone number"
                                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                                {isSubmitting ? "Submitting..." : "Submit Report"}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}
