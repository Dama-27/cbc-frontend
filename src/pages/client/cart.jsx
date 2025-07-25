import { useState } from "react"
import { getCart } from "../../utils/cart"
import { BiMinus, BiPlus, BiTrash } from "react-icons/bi"

export default function CartPage(){
    const [cart, setCart] = useState(getCart())

    return(
        <div className="w-full h-full flex flex-col items-center pt-4">
            {
                cart.map(
                    (item)=>{
                        return(
                            <div key={item.productId} className="w-[600px] h-[100px] my-3 bg-primary shadow-2xl flex flex-row rounded-tl-3xl rounded-tr-3xl rounded-br-3xl rounded-bl-3xl relative justify-center items-center">
                                <img src={item.image} className="w-[100px] h-[100px] object-cover rounded-3xl"/>
                                <div className="w-[250px] h-full flex flex-col justify-center items-start pl-4">
                                    <h1 className="text-xl text-secondary font-semibold">{item.name}</h1>
                                    <h1 className="text-md text-gray-600 font-semibold">Rs. {item.productId}</h1>
                                    {
                                        item.labelledPrice>item.price?
                                        <div>
                                            <span className="text-md mx-1 text-gray-500 font-semibold line-through">Rs. {item.labelledPrice.toFixed(2)}</span> 
                                            <span className="text-md mx-1 text-accent font-semibold">Rs. {item.price.toFixed(2)}</span>
                                        </div>
                                        :
                                        <span className="text-md text-secondary font-semibold">Rs. {item.price.toFixed(2)}</span>

                                    }
                                </div>
                                <div className="w-[100px] max-w-[100px] h-full flex flex-row justify-evenly items-center">
                                    <button className="aspect-square text-white bg-accent font-bold rounded-xl p-2 hover:bg-secondary transition-all duration-300 text-xl cursor-pointer"><BiPlus /></button>
                                    <h1 className="h-full text-xl text-secondary font-semibold flex justify-center items-center">{item.qty}</h1>
                                    <button className="aspect-square text-white bg-accent font-bold rounded-xl p-2 hover:bg-secondary transition-all duration-300 text-xl cursor-pointer"><BiMinus /></button>   
                                </div> 

                                <div className="w-[150px] h-full flex flex-col justify-center items-end pr-4">
                                    <h1 className="text-2xl text-secondary font-semibold">Rs. {(item.price * item.qty).toFixed(2)}</h1>
                                </div>       
                                <div>
                                    <button className="absolute right-[-35px] top-1/2 -translate-y-1/2 text-red-500 hover:bg-red-600 hover:text-white transition-all duration-300 p-2 rounded-full cursor-pointer">
                                        <BiTrash />
                                    </button>
                                </div>  
                            </div>
                        )
                    })
            }
        </div>
    )
}

