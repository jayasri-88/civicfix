import { create } from "zustand"

// Sample data
const sampleIssues = [
  {
    id: "1",
    trackingId: "civicfix-2025-001",
    category: "Roads",
    title: "Pothole on Main Street",
    description: "Large pothole near the market causing traffic issues",
    location: "Main Street, near market",
    village: "Greenfield Village",
    reporterName: "Rajesh Kumar",
    reporterPhone: "9876543210",
    status: "In Progress",
    priority: "High",
    images: ["/pothole.png"],
    createdAt: new Date("2025-10-15"),
    updatedAt: new Date("2025-10-18"),
    remarks: "Repair work scheduled for next week",
    assignedDepartment: "Public Works",
    timeline: [
      { status: "Submitted", date: new Date("2025-10-15"), remarks: "Issue reported" },
      { status: "Under Review", date: new Date("2025-10-16"), remarks: "Reviewed by department" },
      { status: "In Progress", date: new Date("2025-10-18"), remarks: "Repair work started" },
    ],
  },
  {
    id: "2",
    trackingId: "civicfix-2025-002",
    category: "Water Supply",
    title: "Water pipe burst",
    description: "Water leakage from main supply pipe near school",
    location: "School Road",
    village: "Greenfield Village",
    reporterName: "Priya Singh",
    reporterPhone: "9876543211",
    status: "Resolved",
    priority: "High",
    images: ["/water-pipe.jpg"],
    createdAt: new Date("2025-10-10"),
    updatedAt: new Date("2025-10-17"),
    remarks: "Pipe replaced successfully",
    assignedDepartment: "Water Department",
    timeline: [
      { status: "Submitted", date: new Date("2025-10-10"), remarks: "Issue reported" },
      { status: "Under Review", date: new Date("2025-10-11"), remarks: "Assessed by team" },
      { status: "In Progress", date: new Date("2025-10-14"), remarks: "Repair in progress" },
      { status: "Resolved", date: new Date("2025-10-17"), remarks: "Pipe replaced and tested" },
    ],
  },
  {
    id: "3",
    trackingId: "civicfix-2025-003",
    category: "Electricity",
    title: "Street light not working",
    description: "Street light near the temple is not functioning",
    location: "Temple Road",
    village: "Greenfield Village",
    reporterName: "Amit Patel",
    reporterPhone: "9876543212",
    status: "Submitted",
    priority: "Medium",
    images: ["/street-light.jpg"],
    createdAt: new Date("2025-10-19"),
    updatedAt: new Date("2025-10-19"),
    remarks: "",
    assignedDepartment: undefined,
    timeline: [{ status: "Submitted", date: new Date("2025-10-19"), remarks: "Issue reported" }],
  },
]

export const useIssueStore = create((set, get) => ({
  issues: sampleIssues,

  addIssue: (issue) =>
    set((state) => {
      const newIssue = {
        ...issue,
        id: Math.random().toString(36).substr(2, 9),
        trackingId: `civicfix-2025-${String(state.issues.length + 1).padStart(3, "0")}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        timeline: [
          {
            status: "Submitted",
            date: new Date(),
            remarks: "Issue reported",
          },
        ],
      }
      return { issues: [...state.issues, newIssue] }
    }),

  updateIssue: (id, updates) =>
    set((state) => ({
      issues: state.issues.map((issue) =>
        issue.id === id
          ? {
            ...issue,
            ...updates,
            updatedAt: new Date(),
            timeline:
              updates.status && updates.status !== issue.status
                ? [
                  ...issue.timeline,
                  {
                    status: updates.status,
                    date: new Date(),
                    remarks: updates.remarks || "",
                  },
                ]
                : issue.timeline,
          }
          : issue,
      ),
    })),

  getIssueById: (id) => get().issues.find((issue) => issue.id === id),

  getIssueByTrackingId: (trackingId) => get().issues.find((issue) => issue.trackingId === trackingId),
}))
