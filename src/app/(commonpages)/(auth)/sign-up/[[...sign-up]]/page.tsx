import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
            <div className="h-full bg-primary hidden md:flex items-center justify-center">
                <h1 className="text-7xl font-bold text-red-500">E</h1>
                <h1 className="text-7xl font-bold text-gray-500">-</h1>
                <h1 className="text-7xl font-bold text-yellow-500">Mart</h1>
            </div>
            <div className="flex items-center justify-center h-full">
                <div className="w-[400px] flex flex-col gap-5">
                    <div>
                        <h1 className="uppercase font-extrabold text-2xl">Register</h1>

                        <hr />

                        <div className="mt-5">
                            <SignUp/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );0
}