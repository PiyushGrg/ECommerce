"use client";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Provider } from "react-redux";
import { Badge, Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { useClerk } from "@clerk/nextjs";
import { useUser } from "@clerk/clerk-react";
import store from "@/redux/Store";
import axios from "axios";
import toast from "react-hot-toast";


function LayoutProvider({ children }: { children: React.ReactNode }) {

    const { signOut } = useClerk();
    const user = useUser();

    const router = useRouter();
    const pathname = usePathname();
    const isPublic = pathname.includes("/sign-up") || pathname.includes("/sign-in");

    const [isAdmin, setIsAdmin] = React.useState(false);

    const getUserData = async () => {
        try {
          const response = await axios.get("/api/current-user");
          if (response.data.user.isAdmin) {
            setIsAdmin(true);
          }
        } catch (error: any) {
          toast.error(error.message);
        }
      };
    
    useEffect(() => {
        if (!isPublic) {
          getUserData();
        }
    }, []);
    
      
  return (
    <Provider store={store}>
        <div>

            {!isPublic && (
                <div className="header bg-gray-800 px-5 py-4 flex justify-between items-center">
                    <h1
                    className="text-2xl font-black cursor-pointer text-red-400"
                    onClick={() => {
                        router.push("/");
                        router.refresh();
                    }}
                    >
                    E <span className="text-yellow-500 font-semibold">Mart</span>
                    </h1>

        
        
                    <div className="flex gap-5 items-center">
                        <Badge content='3'>
                            <i
                            className="ri-shopping-cart-line text-white text-2xl cursor-pointer"
                            onClick={() => {
                                router.push("/cart");
                                router.refresh();
                            }} />
                        </Badge>
                        <Popover>
                            <PopoverTrigger>
                                <span className="text-white cursor-pointer">{user.user?.username?.toLocaleUpperCase()}</span>
                            </PopoverTrigger>
                            
                            <PopoverContent>
                                <div className="flex flex-col gap-2 p-2">
                                    <div
                                        className="flex gap-2 items-center cursor-pointer text-md"
                                        onClick={() => {
                                            router.push("/admin");
                                            router.refresh();
                                        }}
                                    >
                                        <i className="ri-shield-user-line"></i>
                                        <span>Admin</span>
                                    </div>

                                    <div
                                        className="flex gap-2 items-center cursor-pointer text-md"
                                        onClick={() => signOut(() => {
                                            router.push("/");
                                            router.refresh();
                                        })}
                                    >
                                        <i className="ri-logout-box-r-line"></i>
                                        <span>Logout</span>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            )}

            {isPublic && (
                <div>
                    {children}
                </div>
            )}

            {(!isPublic && (!isAdmin && pathname.includes("admin")) ) ? "You are not authorized to view this page" :
                <div className="mx-5">
                    {children}
                </div>
            }

        </div>
    </Provider>
  );
}

export default LayoutProvider;
