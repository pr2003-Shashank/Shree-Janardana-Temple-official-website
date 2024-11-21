import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./layouts/Main.jsx";
import Home from "./pages/home.jsx";
import ItemSelector from "./pages/items.jsx";
import Booking from "./pages/booking.jsx";
import Quotation from "./pages/quotation.jsx";
import Dashboard from "./pages/dashboard.jsx";

function AppRoutes(props) {
    return (
        <>
            <Routes>
                <Route path='/' element={<Main />} >
                    <Route path="/home" element={<Home />} />
                    <Route path='' element={<Navigate to='/home' />} />
                    <Route path="/booking" element={<Booking />} />
                    <Route path="/items" element={<ItemSelector />} />
                    <Route path="/quotation" element={<Quotation />} />
                    <Route path="/dashboard" element={<Dashboard/>} />
                </Route>
            </Routes>
        </>
    );
}
export default AppRoutes;