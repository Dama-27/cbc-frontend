import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom"

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
        }
    ),[]
    return(
        <div className="bg-primary font-family">
            This is OverView {JSON.stringify(product)}
        </div>
    )
}