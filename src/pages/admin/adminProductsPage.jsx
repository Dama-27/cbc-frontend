import { useEffect, useState } from "react"
import { sampleProducts } from "../../assets/sampleData"
import axios from "axios";
import { Link } from "react-router-dom";

export default function AdminProductsPage(){
    const [products, setProducts]=useState(sampleProducts)

    // useEffect(()=>{},[])
    useEffect(
        ()=>{
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products").then((res)=>{
                console.log(res.data)
                setProducts(res.data)
            })
            
        },[]
    )
    

    return(
        <div className="w-full h-full max-h-full overflow-hidden overflow-y-scroll relative" >
            <Link to="/admin/addProduct" className="absolute bottom-5 right-5 bg-green-500 text-xl cursor-pointer text-center flex justify-center items-center rounded px-4 py-2 font-bold" >+</Link>
            {/* <div className="w-full h-[1600px] border-[5px] border-blue-900"></div> */}
            <table className="w-full text-center">
                <thead>
                    <tr>
                        <th>Product ID</th>
                        <th>Name</th>
                        <th>Image</th>
                        <th>Labelled Price</th>
                        <th>Price</th>
                        <th>Stock</th>
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

                                    </tr>
                                )
                            }
                        )
                    }
                </tbody>
            </table>

        </div>
    )

} 