import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./layouts/Main.jsx";
import Home from "./pages/home.jsx";
import GetQuotation from "./pages/quotation.jsx";
import Booking from "./pages/booking.jsx";

function AppRoutes(props) {
    return (
        <>
            <Routes>
                <Route path='/' element={<Main />}>
                    <Route path="" element={<Home />} />
                    <Route path='' element={<Navigate to='/home' />} />
                    <Route path="/booking" element={<Booking/>}/>
                    <Route path="/quotation" element={<GetQuotation/>}/>
                </Route>
            </Routes>
        </>
    );
}
export default AppRoutes;