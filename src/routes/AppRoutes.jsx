import { Route, Routes, Navigate } from "react-router-dom";
import Main from "../layouts/Main.jsx";
import Home from "../pages/home.jsx";
import Login from "../pages/login.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import ItemSelector from "../pages/items.jsx";
import Booking from "../pages/booking.jsx";
import Quotation from "../pages/quotation.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import CalendarView from "../pages/calendarView.jsx";
import FunctionsView from "../pages/functionsView.jsx";
import GetDetails from "../pages/getDetails.jsx";
import StaffManagement from "../pages/staffManagement.jsx";


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
                    <Route path="/getDetails" element={<GetDetails />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={
                    <PrivateRoute>
                        <DashboardLayout />
                    </PrivateRoute>
                }>
                    <Route path='' element={<Navigate to="/admin/calendar" />} />
                    <Route path="/admin/calendar" element={<CalendarView />} />
                    <Route path="/admin/functions" element={<FunctionsView />} />
                    <Route path="/admin/staff" element={<StaffManagement/>}/>
                </Route>
            </Routes>
        </>
    );
}
export default AppRoutes;