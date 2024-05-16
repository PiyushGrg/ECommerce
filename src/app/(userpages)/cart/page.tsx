/* eslint-disable @next/next/no-img-element */
"use client";
import { ProductType } from "@/interfaces";
import { AddItemToCart, ClearItemInCart, RemoveItemFromCart } from "@/redux/CartSlice";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createCheckoutSession } from "@/actions/checkout";
import { createOrder } from "@/actions/config";

function Cart() {
  
  const { items,cartPrice } = useSelector((state: any) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleCheckout = async() => {
    try {
      const order = await createOrder({items,cartPrice});
      const orderId = order.order._id;
      
      // create payment session
      const response = await createCheckoutSession({orderId});
      if(response.url){
        router.push(response.url);
      }
      else{
        throw new Error('Unable to retrieve payment URL');
      }
    } catch (error:any) {
      toast.error(error.message);
      // console.log(error.message);
    }
  }

  return (
    <div>
      {items.length > 0 && (
        <div>
          <h1 className="text-2xl font-bold text-gray-800 my-5">My Cart</h1>
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-4">
          <div className="grid grid-cols-3 gap-10">
            <div className="col-span-2">
              <div className="grid grid-cols-5 gap-2 my-5">
                <h1 className="text-sm col-span-2">Product</h1>
                <h1 className="text-sm">Each</h1>
                <h1 className="text-sm">Quantity</h1>
                <h1 className="text-sm">Total</h1>
              </div>
              <hr className="border border-solid border-gray-300" />

              <div className="flex flex-col gap-5 mt-5">
                {items.map((item: ProductType) => (
                  <div
                    className="grid grid-cols-5 gap-2  items-center"
                    key={item._id}
                  >
                    <div className="flex gap-2 col-span-2 items-center">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-20 h-20 object-contain border border-solid border-gray-200 rounded p-2"
                      />
                      <div className="flex flex-col gap-2">
                        <h1 className="text-sm text-gray-500">{item.name}</h1>

                        <span
                          className="text-red-700 cursor-pointer underline text-sm"
                          onClick={() => dispatch(ClearItemInCart(item._id))}
                        >
                          Remove
                        </span>
                      </div>
                    </div>
                    <h1 className="text-sm text-gray-500">Rs {item.price}</h1>

                    <div className="flex items-center gap-5 border border-gray-400 rounded border-solid px-5 py-2 w-max">
                      <i
                        className="ri-subtract-line cursor-pointer"
                        onClick={() => dispatch(RemoveItemFromCart(item._id))}
                      ></i>
                      <span>{item.quantity}</span>
                      <i
                        className="ri-add-line cursor-pointer"
                        onClick={() => dispatch(AddItemToCart(item))}
                      ></i>
                    </div>

                    <h1 className="text-sm text-gray-700 font-semibold">
                      Rs {item.price * item.quantity}
                    </h1>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-1">
              <div className="bg-gray-100 p-5 rounded">
                <h1 className="text-sm text-gray-500">Total</h1>
                <h1 className="text-2xl font-semibold text-gray-800">
                  Rs{" "}
                  {items.reduce(
                    (acc: number, item: ProductType) =>
                      acc + item.price * item.quantity,
                    0
                  )}
                </h1>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-red-700 text-white py-2 rounded mt-5"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-5 mt-10">
          <i className="ri-shopping-cart-line text-5xl"></i>
          <h1 className="text-xl">Your cart is empty</h1>
        </div>
      )}
    </div>
  );
}

export default Cart;
