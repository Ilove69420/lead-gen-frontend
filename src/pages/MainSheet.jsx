import { useEffect, useState } from "react";
import { api } from "../api";

export default function MainSheet({ isAdmin }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await api.listMainSheet();
      setEntries(data.leads);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(leadId) {
    if (!confirm("Delete this shared lead from the Main Sheet?")) return;
    try {
      await api.deleteMainSheetLead(leadId);
      setEntries((prev) => prev.filter((e) => e.leadId !== leadId));
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleClearAll() {
    if (!confirm("Clear the ENTIRE Main Sheet? This can't be undone.")) return;
    try {
      await api.clearMainSheet();
      setEntries([]);
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div className="main">Loading Main Sheet...</div>;

  return (
    <div className="main">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Main Sheet</h2>
        {isAdmin && entries.length > 0 && (
          <button className="btn btn-danger btn-small" onClick={handleClearAll}>
            Clear entire sheet
          </button>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}

      {entries.length === 0 ? (
        <div className="empty-state">
          <p>Nothing shared yet. Leads appear here once someone shares them from My Leads.</p>
        </div>
      ) : (
        <div className="card" style={{ marginTop: 16 }}>
          {entries.map((entry, i) => (
            <div
              key={entry.leadId || i}
              style={{
                display: "grid",
                gridTemplateColumns: isAdmin ? "1fr 120px 120px 160px 150px 70px" : "1fr 120px 120px 160px 150px",
                gap: 10,
                alignItems: "center",
                padding: "10px 12px",
                borderBottom: i < entries.length - 1 ? "1px solid var(--border)" : "none",
                fontSize: 13.5,
              }}
            >
              <div>
                <div style={{ fontWeight: 500 }}>{entry.business}</div>
                {entry.notes && <div className="lead-meta">{entry.notes}</div>}
              </div>
              <div className="lead-meta">{entry.city}</div>
              <span className="type-badge">{entry.type}</span>
              <div className="lead-meta">{entry.addedBy}</div>
              <div className="lead-meta">
                {entry.dateShared ? new Date(entry.dateShared).toLocaleDateString() : ""}
              </div>
              {isAdmin && (
                <button
                  className="btn btn-danger btn-small"
                  onClick={() => handleDelete(entry.leadId)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
