import { Routes, Route } from "react-router-dom";
import Home from "./Admin/pages/Home";
import ManageMembers from "./Admin/pages/ManageMembers";
import AddEvents from "./Admin/pages/AddEvents";
import AddNotice from "./Admin/pages/AddNotice";
import Maintenance from "./Admin/pages/Maintenance";
import Complaints from "./Admin/pages/Complaints";
import Visitors from "./Admin/pages/Visitors";
import Expenses from "./Admin/pages/Expenses";
import Transactions from "./Admin/pages/Transactions";
import Login from "./Admin/pages/Login";
import LoginUser from "./User/components/LoginUser";
import AddSociety from "./Admin/pages/AddSociety";
import VisitorForm from "./Admin/pages/VisitorForm";
import ProtectedRoute from "./Admin/pages/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* ✅ Default route → Home page */}
      <Route path="/" element={<Home />} />

      {/* ✅ Protected Admin Routes */}
      <Route
        path="/manage-members"
        element={
          <ProtectedRoute>
            <ManageMembers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-events"
        element={
          <ProtectedRoute>
            <AddEvents />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-notice"
        element={
          <ProtectedRoute>
            <AddNotice />
          </ProtectedRoute>
        }
      />

      <Route
        path="/maintenance"
        element={
          <ProtectedRoute>
            <Maintenance />
          </ProtectedRoute>
        }
      />

      <Route
        path="/complaints"
        element={
          <ProtectedRoute>
            <Complaints />
          </ProtectedRoute>
        }
      />

      <Route
        path="/visitors"
        element={
          <ProtectedRoute>
            <Visitors />
          </ProtectedRoute>
        }
      />

      <Route
        path="/expenses"
        element={
          <ProtectedRoute>
            <Expenses />
          </ProtectedRoute>
        }
      />

      <Route
        path="/visitor-form"
        element={
          <ProtectedRoute>
            <VisitorForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        }
      />

      {/* ✅ Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/login-user" element={<LoginUser />} />
      <Route path="/add-society" element={<AddSociety />} />
    </Routes>
  );
}

export default App;