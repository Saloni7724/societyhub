import { Routes, Route } from "react-router-dom";
// User Pages
import './App.css';
import LoginUser from "./User/components/LoginUser";
import EmergencyContact from "./User/components/EmergencyContact";
import Events from "./User/components/Events";
import Profile from "./User/components/Profile";
import Complaint from "./User/components/Complaint";
import Notification from "./User/components/Notification";  
import ResidentList from "./User/components/ResidentList";  
import Dashboard from "./User/components/Dashboard";
import PendingAmount from "./User/components/PendingAmount";
import PaymentMaintenance from "./User/components/PaymentMaintenance";
import NotificationPopup from "./User/components/NotificationPopup";    

// Admin Pages
import Home from './Admin/pages/Home';
import Login from './Admin/pages/Login';
import AddSociety from "./Admin/pages/AddSociety";
import ManageMembers from "./Admin/pages/ManageMembers";
import AddEvents from "./Admin/pages/AddEvents";
import AddNotice from "./Admin/pages/AddNotice";
import Maintenance from "./Admin/pages/Maintenance";
import Complaints from "./Admin/pages/Complaints";
import Visitors from "./Admin/pages/Visitors";
import Expenses from "./Admin/pages/Expenses";
import Transactions from "./Admin/pages/Transactions";



function App() {
  return (

   <Routes>
    {/* User Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/LoginUser" element={<LoginUser />} />
    <Route path="/EmergencyContact" element={<EmergencyContact />} />
    <Route path="/Events" element={<Events />} />
    <Route path="/Profile" element={<Profile />} />
    <Route path="/Complaint" element={<Complaint />} />
    <Route path="/Notification" element={<Notification />} /> 
    <Route path="/ResidentList" element={<ResidentList />} />
    <Route path="/Dashboard" element={<Dashboard />} /> 
    <Route path="/PendingAmount" element={<PendingAmount />} />
    <Route path="/PaymentMaintenance" element={<PaymentMaintenance />} /> 
    <Route path="/NotificationPopup" element={<NotificationPopup />} />
   

    {/* Admin Routes */}
    <Route path="/" element={<ManageMembers />} />
    <Route path="/Login" element={<Login />} />
    <Route path="/AddSociety" element={<AddSociety />} />
    <Route path="/add-events" element={<AddEvents />} />
    <Route path="/add-notice" element={<AddNotice />} />
    <Route path="/maintenance" element={<Maintenance />} />
    <Route path="/complaints" element={<Complaints />} />
    <Route path="/visitors" element={<Visitors />} />
    <Route path="/expenses" element={<Expenses />} />
    <Route path="/transactions" element={<Transactions />} />
    

  </Routes>

  );
}

export default App;
