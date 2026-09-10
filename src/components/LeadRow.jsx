import { useState } from "react";

const STATUSES = [
  "Not Called",
  "Called",
  "Interested",
  "Not Interested",
  "Follow-Up Later",
];

export default function LeadRow({ lead, onUpdate, onShare, onDelete }) {
  const [notesDraft, setNotesDraft] = useState(lead.notes);
  const [followUpDraft, setFollowUpDraft] = useState(lead.followUpDate || "");

  const followUpDue =
    lead.followUpDate && new Date(lead.followUpDate) <= new Date();

  return (
    <div className="lead-row">
      <div>
        <div className="lead-name">
          {lead.name}
          {lead.website === "" && (
            <span className="type-badge" style={{ marginLeft: 8 }}>
              No Website
            </span>
          )}
        </div>
        <div className="lead-meta">
          {lead.address} {lead.phone && `· ${lead.phone}`}
        </div>
        <input
          type="text"
          placeholder="Notes (e.g. spoke to owner, call back Thursday)"
          value={notesDraft}
          onChange={(e) => setNotesDraft(e.target.value)}
          onBlur={() => {
            if (notesDraft !== lead.notes) onUpdate({ notes: notesDraft });
          }}
          style={{ width: "100%", marginTop: 6, fontSize: 12.5 }}
        />
      </div>

      <span className="type-badge">{lead.type}</span>

      <select
        value={lead.status}
        onChange={(e) => onUpdate({ status: e.target.value })}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={followUpDraft}
        onChange={(e) => setFollowUpDraft(e.target.value)}
        onBlur={() => {
          if (followUpDraft !== lead.followUpDate)
            onUpdate({ followUpDate: followUpDraft });
        }}
        style={{
          fontSize: 12,
          borderColor: followUpDue ? "var(--warning)" : undefined,
        }}
      />

      <div className="lead-meta" title="Times called">
        📞 {lead.callCount}
      </div>

      <button
        className={`priority-star ${lead.priority ? "active" : ""}`}
        onClick={() => onUpdate({ priority: !lead.priority })}
        title="Toggle priority"
      >
        ★
      </button>

      <div style={{ display: "flex", gap: 4 }}>
        {!lead.shared && (
          <button className="btn btn-secondary btn-small" onClick={onShare}>
            Share
          </button>
        )}
        <button className="btn btn-danger btn-small" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
