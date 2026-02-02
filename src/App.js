import { Routes, Route } from "react-router-dom";
import './App.css';
import Home from './Admin/pages/Home';
import Login from './Admin/pages/Login';
import AddSociety from "./Admin/pages/AddSociety";
//import ManageMembers from "./Admin/pages/ManageMembers";
//import AddMember from "./Admin/pages/AddMember";





function App() {
  return (
   <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/Login" element={<Login />} />
    <Route path="/AddSociety" element={<AddSociety />} />
    

   </Routes>
  );
}

export default App;
  