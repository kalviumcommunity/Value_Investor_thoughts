
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import "../src/index.css";
import { Register } from "./components/Register";
import SearchBar from "./components/SearchComponent/SearchBar";
import Header from "./components/Header";
import UserPage from "./components/UserPage";
import Explore from "./components/Explore.jsx"
import userAtom from "../Atoms/CurrentUser";
import { useRecoilValue } from "recoil";
import LogoutButton from "./components/LogoutButton.jsx";
import CreatePost from "./components/CreatePost.jsx";

import UpdateProfilePage from "./components/UpdateProfilePage.jsx";

function App() {
  const user = useRecoilValue(userAtom);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/Register" />} />
        <Route path="/Register" element={<Register />} />
        <Route
          path="/Explore"
          element={user ? <Explore /> : <Navigate to="/" />}
        />
        <Route
          path="/SearchBar"
          element={user ? <SearchBar /> : <Navigate to="/" />}
        />
        <Route
          path="/updateUser"
          element={user ? <UpdateProfilePage /> : <Navigate to="/" />}
        />
   
        <Route path="/userPage" 
        element={user ? <UserPage /> :<Navigate to="/"/>}/>
       <Route
          path="/createPost"
          element={user ? <CreatePost /> : <Navigate to="/" />}
        />
      </Routes>
      {user && <LogoutButton />}
    </Router>
  );
}

export default App;
