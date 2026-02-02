import Login from "./User/components/Login";
import { Routes, Route } from "react-router-dom";
import Profile from "./User/components/Profile";
import EmergencyContact from "./User/components/EmergencyContact";
import Events from "./User/components/Events";
import SocietyEvents from "./User/components/SocietyEvents";

function App() {
 

   //return <Events />;
   //return <SocietyEvents />;
   return <Login />;


    /*<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/emergencycontact" element={<EmergencyContact />} />
</Routes>*/

}




export default App;
