
import React, { useState } from "react";
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
  // const user = useRecoilValue(userAtom);

  const [userData,setUserData] = useState( localStorage.getItem('CurrentUser'))
  // console.log(userData)


  return (
    <Router>
      <Header userData={userData} />
      <Routes>
        <Route path="/" element={userData? <Navigate to="/userPage" />:<Navigate to="/Register" />} />
        <Route path="/Register" element={<Register setUserData={setUserData} />} />
        <Route
          path="/Explore"
          element={userData ? <Explore /> : <Navigate to="/" />}
        />
        <Route
          path="/SearchBar"
          element={userData ? <SearchBar /> : <Navigate to="/" />}
        />
        <Route
          path="/updateUser"
          element={userData ? <UpdateProfilePage /> : <Navigate to="/" />}
        />
        <Route path="/userpage" 
        element={ <UserPage/>}/>
       <Route
          path="/createPost"
          element={userData ? <CreatePost  /> : <Navigate to="/" />}
        />
      </Routes>
      {userData && <LogoutButton setUserData={setUserData} />}
    </Router>
  );
}

export default App;
