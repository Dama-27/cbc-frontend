import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { BiMinus, BiPlus, BiTrash } from "react-icons/bi";
import { Link, useLocation } from "react-router-dom";

export default function CheckoutPage() {
  const location = useLocation();
  console.log(location.state.cart);

  const [cart, setCart] = useState(location.state?.cart || []);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");

  // function getTotal() {
  //   let total = 0;
  //   cart.forEach((item) => {
  //     total += item.price * item.qty;
  //   });
  //   return total;
  // }

  function removeFromCart(index) {
    const newCart = cart.filter((item, i) => i !== index);
    setCart(newCart);
  }

  function changeQty(index, qty) {
    const newQty = cart[index].qty + qty;

    if (newQty < 1) {
      removeFromCart(index);
      return;
    } else {
      const newCart = [...cart]; //Distruction
      newCart[index].qty = newQty;
      setCart(newCart);
    }
  }

  async function placeOrder() {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to place order");
      return;
    }

    const orderInfomation = {
      products: [],
      phone: phoneNumber,
      address: address,
      // total: getTotal(),
      // labelledTotal: cart.reduce((sum, item) => sum + (item.labelledPrice * item.qty), 0)
    };

    for (let i = 0; i < cart.length; i++) {
      const item = {
        productId: cart[i].productId,
        Qty: cart[i].qty,
      };

      orderInfomation.products[i] = item;
    }
    try {
      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/orders",
        orderInfomation,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      toast.success("Order placed successfully");
      console.log(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to place order");
      return;
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center pt-4 relative">
      <div className="w-[350px] px-1 gap-2 shadow-2xl absolute top-1 right-1 flex  flex-col justify-center items-center">
        <p className="text-2xl text-secondary font-bold">
          Total:
          <span className="text-accent font-bold mx-2">{}</span>
        </p>
        <div className="w-full h-full flex flex-col justify-center items-center">
          <input
            type="text"
            placeholder="Phone Number"
            className="w-[300px] h-[40px] my-1 px-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-accent transition-all duration-300"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <input
            type="text"
            placeholder="Address"
            className="w-[300px] h-[40px] my-1 px-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-accent transition-all duration-300"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <button className="text-white bg-accent px-4 py-2 mb-3 rounded-lg font-bold hover:bg-secondary transition-all duration-300"
          onClick={placeOrder}
        >
          Place Order
        </button>
      </div>
      {cart.map((item, index) => {
        return (
          <div
            key={item.productId}
            className="w-[600px] h-[100px] my-3 bg-primary shadow-2xl flex flex-row rounded-tl-3xl rounded-tr-3xl rounded-br-3xl rounded-bl-3xl relative justify-center items-center"
          >
            <img
              src={item.image}
              className="w-[100px] h-[100px] object-cover rounded-3xl"
            />
            <div className="w-[250px] h-full flex flex-col justify-center items-start pl-4">
              <h1 className="text-xl text-secondary font-semibold">
                {item.name}
              </h1>
              <h1 className="text-md text-gray-600 font-semibold">
                Rs. {item.productId}
              </h1>
              {item.labelledPrice > item.price ? (
                <div>
                  <span className="text-md mx-1 text-gray-500 font-semibold line-through">
                    Rs. {item.labelledPrice.toFixed(2)}
                  </span>
                  <span className="text-md mx-1 text-accent font-semibold">
                    Rs. {item.price.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-md text-secondary font-semibold">
                  Rs. {item.price.toFixed(2)}
                </span>
              )}
            </div>
            <div className="w-[100px] max-w-[100px] h-full flex flex-row justify-evenly items-center">
              <button
                className="aspect-square text-white bg-accent font-bold rounded-xl p-2 hover:bg-secondary transition-all duration-300 text-xl cursor-pointer"
                onClick={() => {
                  changeQty(index, -1);
                }}
              >
                <BiMinus />
              </button>
              <h1 className="h-full text-xl text-secondary font-semibold flex justify-center items-center">
                {item.qty}
              </h1>
              <button
                className="aspect-square text-white bg-accent font-bold rounded-xl p-2 hover:bg-secondary transition-all duration-300 text-xl cursor-pointer"
                onClick={() => {
                  changeQty(index, 1);
                }}
              >
                <BiPlus />
              </button>
            </div>

            <div className="w-[150px] h-full flex flex-col justify-center items-end pr-4">
              <h1 className="text-2xl text-secondary font-semibold">
                Rs. {(item.price * item.qty).toFixed(2)}
              </h1>
            </div>
            <div>
              <button
                className="absolute right-[-35px] top-1/2 -translate-y-1/2 text-red-500 hover:bg-red-600 hover:text-white transition-all duration-300 p-2 rounded-full cursor-pointer"
                onClick={() => {
                  removeFromCart(index);
                }}
              >
                <BiTrash />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
