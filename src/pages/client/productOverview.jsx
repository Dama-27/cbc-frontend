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
                <div className="w-[50%] bg-blue-900 h-full">

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