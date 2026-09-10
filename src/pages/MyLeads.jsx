import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import LeadRow from "../components/LeadRow";

export default function MyLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openBatchId, setOpenBatchId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("none");
  const [showInstructions, setShowInstructions] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await api.listMyLeads();
      setLeads(data.leads);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpdate(leadId, changes) {
    // optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.leadId === leadId ? { ...l, ...changes } : l))
    );
    try {
      await api.updateLead({ leadId, ...changes });
    } catch (err) {
      setError(err.message);
      load(); // revert to real state on failure
    }
  }

  async function handleShare(leadId) {
    try {
      await api.shareLead(leadId);
      setLeads((prev) =>
        prev.map((l) => (l.leadId === leadId ? { ...l, shared: true } : l))
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(leadId) {
    if (!confirm("Delete this lead? This can't be undone.")) return;
    try {
      await api.deleteOwnLead(leadId);
      setLeads((prev) => prev.filter((l) => l.leadId !== leadId));
    } catch (err) {
      setError(err.message);
    }
  }

  const batches = useMemo(() => {
    const map = new Map();
    for (const lead of leads) {
      if (!map.has(lead.batchId)) map.set(lead.batchId, []);
      map.get(lead.batchId).push(lead);
    }
    return Array.from(map.entries()); // [ [batchId, leads[]], ... ]
  }, [leads]);

  const followUpsDue = useMemo(
    () =>
      leads.filter(
        (l) => l.followUpDate && new Date(l.followUpDate) <= new Date()
      ),
    [leads]
  );

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const term = searchTerm.toLowerCase();
    return leads.filter((l) => l.name.toLowerCase().includes(term));
  }, [searchTerm, leads]);

  function sortLeads(list) {
    if (sortBy === "type") return [...list].sort((a, b) => a.type.localeCompare(b.type));
    if (sortBy === "status") return [...list].sort((a, b) => a.status.localeCompare(b.status));
    if (sortBy === "alpha") return [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }

  if (loading) return <div className="main">Loading your leads...</div>;

  // ---- Empty state ----
  if (leads.length === 0 && !showInstructions) {
    return (
      <div className="main">
        <h2>My Leads</h2>
        <div className="empty-state">
          <p>No leads yet. Run a search to discover some.</p>
          <button
            className="btn btn-primary"
            onClick={() => setShowInstructions(true)}
            style={{ marginTop: 12 }}
          >
            Discover Leads
          </button>
        </div>
      </div>
    );
  }

  if (showInstructions && leads.length === 0) {
    return (
      <div className="main">
        <h2>Discover Leads</h2>
        <div className="card" style={{ marginTop: 16, maxWidth: 560 }}>
          <p>
            Searching happens through a small script that runs on your own
            computer (not in the browser).
          </p>
          <ol style={{ paddingLeft: 20, lineHeight: 1.9 }}>
            <li>Download the companion script (ask whoever set this app up for the folder/link).</li>
            <li>Run <code>npm install</code> once, then <code>node discover.js</code> each time you want to search.</li>
            <li>Log in with the same email/password as this app, then enter a city and business type.</li>
            <li>When it finishes, come back here and refresh — your new batch will appear.</li>
          </ol>
          <button className="btn btn-secondary" onClick={() => setShowInstructions(false)}>
            Back
          </button>
        </div>
      </div>
    );
  }

  const openBatchLeads = openBatchId
    ? sortLeads(leads.filter((l) => l.batchId === openBatchId))
    : null;

  return (
    <div className="main">
      <h2>My Leads</h2>

      <input
        type="text"
        placeholder="Search all your leads by business name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: "100%", marginTop: 16 }}
      />

      {error && <p className="error-text">{error}</p>}

      {followUpsDue.length > 0 && !searchResults && (
        <div className="followups-banner">
          {followUpsDue.length} follow-up{followUpsDue.length > 1 ? "s" : ""} due —{" "}
          {followUpsDue.map((l) => l.name).join(", ")}
        </div>
      )}

      {searchResults ? (
        <>
          <h3 style={{ marginTop: 20, marginBottom: 8, fontSize: 14, color: "var(--text-dim)" }}>
            {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
          </h3>
          <div className="card">
            {searchResults.map((lead) => (
              <LeadRow
                key={lead.leadId}
                lead={lead}
                onUpdate={(c) => handleUpdate(lead.leadId, c)}
                onShare={() => handleShare(lead.leadId)}
                onDelete={() => handleDelete(lead.leadId)}
              />
            ))}
          </div>
        </>
      ) : openBatchId ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>
            <button className="nav-link" onClick={() => setOpenBatchId(null)}>
              ← Back to batches
            </button>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="none">Sort: default</option>
              <option value="type">Sort: Type</option>
              <option value="status">Sort: Status</option>
              <option value="alpha">Sort: A–Z</option>
            </select>
          </div>
          <div className="card" style={{ marginTop: 12 }}>
            {openBatchLeads.map((lead) => (
              <LeadRow
                key={lead.leadId}
                lead={lead}
                onUpdate={(c) => handleUpdate(lead.leadId, c)}
                onShare={() => handleShare(lead.leadId)}
                onDelete={() => handleDelete(lead.leadId)}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
            <button className="btn btn-primary" onClick={() => setShowInstructions(true)}>
              Discover more leads
            </button>
          </div>
          <div className="batch-grid">
            {batches.map(([batchId, batchLeads]) => (
              <button
                key={batchId}
                className="card-button"
                onClick={() => setOpenBatchId(batchId)}
              >
                <div style={{ fontWeight: 600 }}>{batchId}</div>
                <div className="lead-meta" style={{ marginTop: 4 }}>
                  {batchLeads.length} lead{batchLeads.length !== 1 ? "s" : ""}
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {showInstructions && leads.length > 0 && (
        <div className="card" style={{ marginTop: 20, maxWidth: 560 }}>
          <p>
            Run <code>node discover.js</code> in the companion script folder,
            log in, enter a city + business type, then come back and refresh
            this page.
          </p>
          <button className="btn btn-secondary" onClick={() => setShowInstructions(false)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}
