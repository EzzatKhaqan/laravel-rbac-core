import { Outlet, NavLink } from "react-router";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";


const DashboardLayout = () => {

    return (
        <div className="h-screen flex bg-gray-100 overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Section */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navbar */}
                <Navbar />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="bg-white min-h-full rounded-md shadow-sm p-6">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;