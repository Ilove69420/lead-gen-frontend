import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth, app } from "./firebase";
import Login from "./pages/Login";
import MyLeads from "./pages/MyLeads";
import MainSheet from "./pages/MainSheet";
import AdminCreateUser from "./pages/AdminCreateUser";

const db = getFirestore(app);

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = not checked yet, null = logged out
  const [role, setRole] = useState(null);
  const [page, setPage] = useState("myLeads");

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const snap = await getDoc(doc(db, "users", u.uid));
          setRole(snap.exists() ? snap.data().role : "user");
        } catch {
          setRole("user");
        }
      } else {
        setRole(null);
        setPage("myLeads");
      }
    });
  }, []);

  if (user === undefined) {
    return <div className="main">Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  const isAdmin = role === "admin";

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">Lead Gen</div>
        <button
          className={`nav-link ${page === "myLeads" ? "active" : ""}`}
          onClick={() => setPage("myLeads")}
        >
          My Leads
        </button>
        <button
          className={`nav-link ${page === "mainSheet" ? "active" : ""}`}
          onClick={() => setPage("mainSheet")}
        >
          Main Sheet
        </button>
        {isAdmin && (
          <button
            className={`nav-link ${page === "admin" ? "active" : ""}`}
            onClick={() => setPage("admin")}
          >
            Create User
          </button>
        )}
        <div className="sidebar-footer">
          <div className="sidebar-email">{user.email}</div>
          <button className="nav-link" onClick={() => signOut(auth)}>
            Log out
          </button>
        </div>
      </aside>

      {page === "myLeads" && <MyLeads />}
      {page === "mainSheet" && <MainSheet isAdmin={isAdmin} />}
      {page === "admin" && isAdmin && <AdminCreateUser />}
    </div>
  );
}
