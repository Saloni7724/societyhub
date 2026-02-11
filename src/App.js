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
//import LoginUser from "./Admin/pages/LoginUser";
import AddSociety from "./Admin/pages/AddSociety";





function App() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/" element={<ManageMembers />} />
      <Route path="/add-events" element={<AddEvents />} />
      <Route path="/add-notice" element={<AddNotice />} />
      <Route path="/maintenance" element={<Maintenance />} />
      <Route path="/complaints" element={<Complaints />} />
      <Route path="/visitors" element={<Visitors />} />
      <Route path="/expenses" element={<Expenses />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/Login" element={<Login />} />
 

      <Route path="/AddSociety" element={<AddSociety />} />
    

    </Routes>
  );
}

export default App;
