import { Button } from "primereact/button";

const UnAuthorized = () => {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 text-center bg-gray-50 font-sans">
            {/* Error Content Card */}
            <div className="bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl p-8 max-w-sm w-full transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">

                {/* Brand Visual Indicator using PrimeIcons */}
                <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-[#24b43c]/10 rounded-full flex items-center justify-center text-[#002855]">
                        {/* PrimeIcon security lock configuration */}
                        <i className="pi pi-lock text-3xl text-[#002855]" style={{ transform: "translateY(-1px)" }}></i>
                    </div>
                </div>

                {/* Typography Header Section */}
                <h2 className="text-2xl font-extrabold tracking-tight text-[#002855] mb-2">
                    Access Forbidden
                </h2>
                <p className="text-gray-400 text-sm mb-6 font-medium leading-relaxed">
                    Your account does not possess the permissions required to look at this directory.
                </p>

                {/* PrimeReact Styled Go Back Action Button */}
                <Button
                    label="Go Back"
                    icon="pi pi-arrow-left"
                    onClick={() => window.history.back()}
                    className="p-button-custom text-white font-semibold px-6 py-3.5 rounded-xl w-full shadow-md shadow-[#24b43c]/10 transition-all duration-200 active:scale-[0.98]"
                />
            </div>
        </div>
    );
}

export default UnAuthorized;
