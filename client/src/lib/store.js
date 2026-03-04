import { create } from "zustand"

const API_URL = "http://localhost:8000"

export const useIssueStore = create((set, get) => ({
  issues: [],
  isLoading: false,

  fetchIssues: async () => {
    set({ isLoading: true })
    try {
      const res = await fetch(`${API_URL}/complaints/`)
      const data = await res.json()

      const mappedIssues = data.map((complaint) => ({
        id: complaint.id,
        trackingId: `VIF-2025-${String(complaint.id).padStart(3, "0")}`,
        category: complaint.category || "Other",
        title: complaint.title,
        description: complaint.description,
        location: complaint.location || "",
        village: "", // not in DB
        reporterName: "", // not in DB
        reporterPhone: "", // not in DB
        status: complaint.status === "Pending" ? "Submitted" : complaint.status,
        priority: "Medium",
        images: complaint.image_path 
          ? [complaint.image_path.startsWith('http') ? complaint.image_path : `${API_URL}/uploads/${complaint.image_path.split("/").pop()}`] 
          : [],
        createdAt: new Date(complaint.created_at),
        updatedAt: new Date(complaint.created_at),
        remarks: "",
        assignedDepartment: complaint.department,
        timeline: [
          { status: complaint.status === "Pending" ? "Submitted" : complaint.status, date: new Date(complaint.created_at), remarks: "Initial status" }
        ],
      }))
      set({ issues: mappedIssues })
    } catch (error) {
      console.error("Failed to fetch issues", error)
    } finally {
      set({ isLoading: false })
    }
  },

  addIssue: async (formData) => {
    set({ isLoading: true })
    try {
      const res = await fetch(`${API_URL}/complaints/`, {
        method: "POST",
        body: formData,
      })
      if (!res.ok) {
        throw new Error("Failed to create issue")
      }
      const data = await res.json()
      // Refresh list
      await get().fetchIssues()
      return data
    } catch (error) {
      console.error("Error creating issue", error)
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  updateIssue: async (id, updates) => {
    try {
      const { status } = updates // we only support updating status on the server currently
      if (status) {
        const formData = new FormData()
        formData.append("status", status)

        const authData = JSON.parse(localStorage.getItem("authorityAuth") || "{}")
        const token = authData.token

        const res = await fetch(`${API_URL}/complaints/${id}/status`, {
          method: "PUT",
          headers: {
            ...(token ? { "Authorization": `Bearer ${token}` } : {}),
          },
          body: formData,
        })
        if (!res.ok) {
          throw new Error("Failed to update status")
        }
      }

      // Update local state directly to be fast
      set((state) => ({
        issues: state.issues.map((issue) =>
          issue.id === id
            ? {
              ...issue,
              ...updates,
              timeline: updates.status && updates.status !== issue.status ? [
                ...issue.timeline,
                {
                  status: updates.status,
                  date: new Date(),
                  remarks: updates.remarks || "",
                },
              ] : issue.timeline,
            }
            : issue
        ),
      }))
    } catch (error) {
      console.error("Error updating issue", error)
    }
  },

  getIssueById: (id) => get().issues.find((issue) => String(issue.id) === String(id)),

  getIssueByTrackingId: (trackingId) => get().issues.find((issue) => issue.trackingId.toUpperCase() === trackingId.toUpperCase()),
}))

