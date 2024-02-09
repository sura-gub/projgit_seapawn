import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WelcomePage from "./pages/welcome";
import Cmpregis from "./pages/regis";
import Log from "./pages/login";
import Home from "./pages/home";
import ArtList from "./pages/artlist";
import ApplyLoan from './pages/loan';
import Intset from './pages/intset';
import Compdet from './pages/compdet';
import Changepass from './pages/changepass';
import Calc from './pages/calc';
import Branch from './pages/branch';
import Staff from './pages/staff';
// import Examt from './pages/examt';
import ActiveCust from './pages/activecust';
import ClosedCust from './pages/ccust';
import AllCust from './pages/allcust';
import Popup from './pages/Popup';
import './App.css';
// import PayNow from './pages/paynow';

function App() {
  return (
    <BrowserRouter>
     <Routes>
     <Route index element={<WelcomePage />} />
     <Route path='regis' element={<Cmpregis />} />
     <Route path='login' element={<Log />} />
     <Route path='home' element={<Home />} />
     <Route path='loan' element={<ApplyLoan />} />
     <Route path='artlist' element={<ArtList />} />
     <Route path='intset' element={<Intset />} />
     <Route path='compdet' element={<Compdet />} />
     <Route path='changepass' element={<Changepass />} />
     <Route path='calc' element={<Calc />} />
     <Route path='branch' element={<Branch />} />
     <Route path='staff' element={<Staff />} />
     {/* <Route path='examt' element={<Examt />} /> */}
     <Route path='activecust' element={<ActiveCust />} />
     <Route path='ccust' element={<ClosedCust />} />
     <Route path='allcust' element={<AllCust />} />
     {/* <Route path='paynow' element={<PayNow />} /> */}
     <Route path='Popup' element={<Popup />} />
     </Routes>
    </BrowserRouter>
   )
}

export default App;
