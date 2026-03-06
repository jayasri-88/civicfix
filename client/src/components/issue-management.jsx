import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function IssueManagementModal({ issue, onClose, onSave }) {
  const [status, setStatus] = useState(issue.status)
  const [priority, setPriority] = useState(issue.priority)
  const [remarks, setRemarks] = useState(issue.remarks)
  const [department, setDepartment] = useState(issue.assignedDepartment || "")

  const handleSave = () => {
    onSave({
      status,
      priority,
      remarks,
      assignedDepartment: department,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-xl font-bold text-foreground">Manage Issue</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Issue Details */}
          <div>
            <h3 className="font-semibold text-foreground mb-2">Issue Details</h3>
            <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
              <p>
                <span className="text-muted-foreground">Tracking ID:</span>{" "}
                <span className="font-mono text-primary">{issue.trackingId}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Title:</span>{" "}
                <span className="font-semibold">{issue.title}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Reporter:</span> <span>{issue.reporterName}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Phone:</span> <span>{issue.reporterPhone}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Location:</span> <span>{issue.location}</span>
              </p>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Submitted</option>
              <option>Under Review</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Rejected</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Assign Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select Department</option>
              <option>Public Works</option>
              <option>Water Department</option>
              <option>Electricity Board</option>
              <option>Sanitation</option>
              <option>Drainage</option>
            </select>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add remarks or updates about this issue"
              rows={4}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Images */}
          {issue.images && issue.images.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-2">Attached Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {issue.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img || "/placeholder.svg"}
                    alt={`Issue ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border bg-secondary/30">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
