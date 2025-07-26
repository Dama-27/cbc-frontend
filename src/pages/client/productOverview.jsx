import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom"
import ImageSlider from "../../components/imageSlider";
import Loading from "../../components/loading";

export default function ProductoverviewPage(){
    const params = useParams();
    const productId = params.id;
    const [status, setStatus] = useState("loading") // sucess, error
    const [product, setProduct] = useState(null)


    useEffect(
        ()=>{
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId).then(
                (res)=>{
                    console.log(res.data)
                    setProduct(res.data)
                    setStatus("success")
                }
            ).catch(
                (error)=>{
                    console.log(error)
                    setStatus("error")
                    toast.error("Error fetching product details")

                }
            )
        },[]
    )
    return(
        <>
        {
            status == "success" && 
            (
            <div className=" w-full h-full flex">
                {/* This is OverView {JSON.stringify(product)} */}
                <div className="w-[50%] h-full flex justify-center items-center">
                    <ImageSlider images = {product.images}/>
                </div>
                <div className="w-[50%] h-full flex justify-center items-center">
                    <div className="w-[500px] h-[500px] flex flex-col items-center">
                        <h1 className="w-full text-center text-4xl text-secondary font-semibold">{product.name}
                            {
                                product.altNames.map((altName,index)=>{
                                    return(
                                        <span key={index} className="text-4xl text-gray-600"> | {altName}</span>
                                    )
                                })
                            }
                        </h1>
                        {/* product id */}
                        <h2 className="w-full text-center my-2 text-gray-600 mt-2">{product.productId}</h2>
                        <p className="w-full text-center my-2 text-gray-600 mt-2">{product.description}</p>
                        {
                            product.labelledPrice > product.price ?
                            <div>
                                <span className="text-4xl mx-4 text-gray-500 line-through">{product.labelledPrice.toFixed(2)}</span>
                                <span className="text-4xl mx-4 font-bold text-accent">{product.price.toFixed(2)}</span>
                            </div>
                            : <span className="text-4xl mx-4 font-bold text-accent">{product.price.toFixed(2)}</span>
                        }
                        <div className="w-full flex justify-center">
                            <button className="w-1/2 h-12 mx-4 cursor-pointer bg-accent text-white font-semibold rounded-md hover:bg-secondary">Buy Now</button>
                            <button className="w-1/2 h-12 mx-4 cursor-pointer bg-accent text-white font-semibold rounded-md hover:bg-secondary">Add to Cart</button>
                        </div>

                        
                    </div>
                    

                </div>
            </div>
            )
        }

        {
            
            status == "loading" && <Loading />
            
            
        }
        </>
    )
}