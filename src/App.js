import { Routes, Route } from "react-router-dom";
import './App.css';
import Home from './Admin/pages/Home';
import Login from './Admin/pages/Login';
import LoginUser from "./User/components/LoginUser";
import AddSociety from "./Admin/pages/AddSociety";
import EmergencyContact from "./User/components/EmergencyContact";
import Events from "./User/components/Events";
import Profile from "./User/components/Profile";
import AddComplain from "./User/components/AddComplain";
import Notification from "./User/components/Notification";  
import ResidentList from "./User/components/ResidentList";  
import Dashboard from "./User/components/Dashboard";
import PendingAmount from "./User/components/PendingAmount";
import PaymentMaintenance from "./User/components/PaymentMaintenance";


function App() {
  return (
   <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/Login" element={<Login />} />
    <Route path="/AddSociety" element={<AddSociety />} />
    <Route path="/LoginUser" element={<LoginUser />} />
    <Route path="/EmergencyContact" element={<EmergencyContact />} />
    <Route path="/Events" element={<Events />} />
    <Route path="/Profile" element={<Profile />} />
    <Route path="/AddComplain" element={<AddComplain />} />
    <Route path="/Notification" element={<Notification />} /> 
    <Route path="/ResidentList" element={<ResidentList />} />
    <Route path="/Dashboard" element={<Dashboard />} /> 
    <Route path="/PendingAmount" element={<PendingAmount />} />
    <Route path="/PaymentMaintenance" element={<PaymentMaintenance />} /> 
   </Routes>
  );
}

export default App;
  