import {Routes, Route, Navigate} from "react-router";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Signup from "./pages/Signup";
import AdminPanel from "./components/AdminPanel.jsx";
import AdminDelete from "./components/AdminDelete";
import Admin from "./pages/Admin";
import {useSelector, useDispatch} from 'react-redux';
import {useEffect} from 'react';
import {checkAuth} from './authSlice.js';
import ProblemPage from "./pages/ProblemPage";

function App() {
    const dispatch = useDispatch();
    const {isAuthenticated, loading, user} = useSelector((state)=>state.auth);

    useEffect(()=>{
        dispatch(checkAuth());
    }, [dispatch]);

    if (loading) {
      return <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>;
    }

  return (
    <>
     <Routes>
        <Route path="/" element={isAuthenticated ?<Homepage></Homepage>:<Navigate to="/login" />}></Route>
        <Route path="/login" element={isAuthenticated ? <Navigate to= '/'/> : <Login></Login>}></Route>
        <Route path="/signup" element={ isAuthenticated ? <Navigate to= '/'/> : <Signup></Signup>}></Route>
        <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
        <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
        <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
        <Route path="/problem/:problemId" element={<ProblemPage/>}></Route>
     </Routes>
    </>
  )
}

export default App
