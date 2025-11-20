import {Routes, Route, Navigate} from "react-router";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import Signup from "./pages/Signup";
import AdminPanel from "./pages/AdminPanel";
import {useSelector, useDispatch} from 'react-redux';
import {useEffect} from 'react';
import {checkAuth} from './authSlice.js';
import MonacoEditor from "./pages/monacoEditor";
import ProblemPage from "./pages/ProblemPage";

function App() {
    const dispatch = useDispatch();
    const {isAuthenticated, loading} = useSelector((state)=>state.auth);

    useEffect(()=>{
        dispatch(checkAuth());
    }, [dispatch]);

    // if (loading) {
    //   return <div className="min-h-screen flex items-center justify-center">
    //     <span className="loading loading-spinner loading-lg"></span>
    //   </div>;
    // }

  return (
    <>
     <Routes>
        <Route path="/" element={<Homepage></Homepage>}></Route>
        <Route path="/login" element={isAuthenticated ? <Navigate to= '/'/> : <Login></Login>}></Route>
        <Route path="/signup" element={ isAuthenticated ? <Navigate to= '/'/> : <Signup></Signup>}></Route>
        <Route path="/admin" element={<AdminPanel/>}></Route>
      {/* <Route 
        path="/admin" 
        element={
          isAuthenticated && user?.role === 'admin' ? 
            <AdminPanel /> : 
            <Navigate to="/" />
        } 
      /> */}
        <Route path="/problem/:problemId" element={<ProblemPage/>}></Route>
      <Route path="/editor" element={<MonacoEditor/>} />
     </Routes>
    </>
  )
}

export default App
