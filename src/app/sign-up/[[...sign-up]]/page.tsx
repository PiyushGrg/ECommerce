import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
            <div className="bg-primary flex items-center justify-center">
                <h1 className="text-7xl text-red-500">E</h1>
                <h1 className="text-7xl text-blue-500">-</h1>
                <h1 className="text-7xl text-yellow-500">Mart</h1>
            </div>
            <div className="items-center justify-center flex">
                <div className="w-96 xl:w-[500px]">
                    <div>
                        <h1 className="my-5 uppercase font-extrabold text-2xl">Register</h1>

                        <hr />

                        <div className="mt-5">
                            <SignUp/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}