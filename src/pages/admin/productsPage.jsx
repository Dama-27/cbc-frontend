import { useEffect, useState } from "react"
import { sampleProducts } from "../../assets/sampleData"
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

export default function AdminProductsPage(){
    const [products, setProducts]=useState(sampleProducts)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    // useEffect(()=>{},[])
    useEffect(
        ()=>{
            if(isLoading == true){
                axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products").then((res)=>{
                console.log(res.data)
                setProducts(res.data)
                setIsLoading(false)
            })
            }   
        },[isLoading] //depencency array
    )
    
    function deleteProduct(productId){
        const token = localStorage.getItem("token")
        if(token == null){        
            toast.error("Please login as admin to delete a product")
            return
        }
        axios.delete(import.meta.env.VITE_BACKEND_URL + "/api/products/" + productId, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res)=>{
            console.log(res.data)
            toast.success("Product deleted successfully")
            // setProducts(products.filter((item)=>item.productId !== productId))
        }).catch((err)=>{
            console.error(err)
            toast.error("Failed to delete product")
        })
    }


    return(
        <div className="w-full h-full max-h-full overflow-hidden overflow-y-scroll relative" >
            <Link to="/admin/addProduct" className="absolute bottom-5 right-5 bg-green-500 text-xl cursor-pointer text-center flex justify-center items-center rounded px-4 py-2 font-bold" >+</Link>
            {/* <div className="w-full h-[1600px] border-[5px] border-blue-900"></div> */}
            {
                // !isLoading && // use this methid of if else method
            isLoading ?
            <div className="w-full h-full flex justify-center items-center">
                <div className="w-[70px] h-[70px] border-[5px] border-gray-300 border-t-blue-900 rounded-full animate-spin"></div>

            </div>
            :
            <table className="w-full text-center">
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Name</th>
                        <th>Image</th>
                        <th>Labelled Price</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {/* <tr>
                        <td>COSM001</td>
                        <td>GlowMate Foundation</td>
                        <td><image src="https://example.com/images/glowmate1.jpg" className="w-[50px] h-[50px]"/></td>
                        <td>4500</td>
                        <td>3999</td>
                        <td>120</td>

                    </tr> */}
                    {
                        products.map(
                            (item,index)=>{
                                return(
                                    // <span key={index}>{item.productId}</span> //key ekak danna hethuwa error eka nathi karaganna
                                    <tr key={index}>
                                        <td>{item.productId}</td>
                                        <td>{item.name}</td>
                                        <td>
                                            <img src={item.images[0]} className="w-[50px] h-[50px]" alt={item.name} />  
                                        </td>
                                        <td>{item.labelledPrice}</td>
                                        <td>{item.price}</td>
                                        <td>{item.stock}</td>
                                        <td>
                                            <div className="flex justify-center items-center gap-2">
                                                <FaTrash className="text-[20px] text-red-300 mx-2 cursor-pointer" onClick={()=>{
                                                    deleteProduct(item.productId)
                                                    setIsLoading(true)
                                                }} />
                                                <FaEdit onClick={()=>{
                                                    navigate("/admin/editProduct",{
                                                        state : item
                                                    })
                                                }} className="text-[20px] text-blue-400 mx-2 cursor-pointer" />
                                            </div>
                                        </td>

                                    </tr>
                                )
                            }
                        )
                    }
                </tbody>
            </table>
            }
            

        </div>
    )

}