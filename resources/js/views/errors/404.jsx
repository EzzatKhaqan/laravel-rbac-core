import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 text-center bg-gray-50 font-sans">
            {/* Error Content Card */}
            <div className="bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl p-8 max-w-sm w-full transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">

                {/* Big 404 Header Display */}
                <h1 className="text-7xl font-black tracking-tighter text-[#002855] mb-2">
                    404
                </h1>

                {/* Brand Visual Indicator using PrimeIcons */}
                <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 bg-[#24b43c]/10 rounded-full flex items-center justify-center text-[#002855]">
                        {/* PrimeIcon map/direction indicator representing a lost path */}
                        <i className="pi pi-map text-2xl text-[#002855]"></i>
                    </div>
                </div>

                {/* Typography Header Section */}
                <h2 className="text-xl font-extrabold tracking-tight text-[#002855] mb-2">
                    Page Not Found
                </h2>
                <p className="text-gray-400 text-sm mb-6 font-medium leading-relaxed">
                    The URL path you are trying to visit does not exist or has been moved to a new destination.
                </p>

                {/* Action Buttons Stack */}
                <div className="space-y-3!">
                    {/* Primary Button: Go Back */}
                    <Button
                        label="Go Back"
                        icon="pi pi-arrow-left"
                        onClick={() => window.history.back()}
                        className="p-button-custom text-white font-semibold px-6 py-3.5 rounded-xl w-full shadow-md shadow-[#24b43c]/10 transition-all duration-200 active:scale-[0.98]"
                    />

                    {/* Secondary Button: Return to Dashboard/Home */}
                    <Button
                        label="Return Home"
                        icon="pi pi-home"
                        onClick={() => navigate("/")}
                        className="p-button-outlined p-button-secondary text-sm font-semibold w-full py-3 rounded-xl border border-gray-200 text-[#002855] hover:bg-gray-50 transition-all"
                    />
                </div>
            </div>
        </div>
    );
};

export default NotFound;
