    import { useState } from "react"
    import toast from "react-hot-toast"
    import { Link, useLocation, useNavigate } from "react-router-dom"
    import mediaUpload from "../../utils/mediaUpload"
    import axios from "axios"

    export default function EditProductPage() {
        const location = useLocation()    
        console.log(location)
            const [productId, setProductId] = useState(location.state.productId)
            const [name, setName] = useState(location.state.name)
            const [altNames, setAltNames] = useState(location.state.altNames.join(","))
            const [description, setDescription] = useState(location.state.description)
            const [images, setImages] = useState([])
            const [labelledPrice, setLabelledPrice] = useState(location.state.labelledPrice)
            const [price, setPrice] = useState(location.state.price)
            const [stock, setStock] = useState(location.state.stock)
            const navigate = useNavigate()
            
        
            async function updateProduct() {
                const token = localStorage.getItem("token")
                if(token == null){
                    toast.error("Please login first")
                    return
                }
                let imageUrls = location.state.images

                const promisesArray=[]
                for(let i=0;i<images.length;i++){
                    promisesArray[i] = mediaUpload(images[i])
                }

                try{
                    if(images.length > 0){
                        imageUrls = await Promise.all(promisesArray)
                    }
                    console.log(imageUrls)

                    const altNameArray = altNames.split(",")
                    
                    const product = {
                        productId : productId,
                        name : name, 
                        altNames : altNameArray,
                        description : description,
                        images : imageUrls,
                        labelledPrice : labelledPrice,
                        price : price,
                        stock : stock

                    }
                    axios.put(import.meta.env.VITE_BACKEND_URL + "/api/products/"+ productId, product, {
                        headers : {
                        "Authorization" : "Bearer " + token
                        }
                    }).then((res)=>{
                        toast.success("Product updated successfully")
                        navigate("/admin/products")
                    }).catch((err)=>{
                        console.log(err)
                        // toast.error("Failed to add product")
                    })
                }
                catch (e){
                    console.log(e)
                }

            }
        return(
            <div className="w-full h-full flex flex-col justify-center items-center bg-green-500">
                <h1 className="text-3xl font-bold mb-4">Edit Product</h1>
                <input type="text"disabled placeholder="Product ID" className="input input-bordered w-full max-w-xs mb-4" value={productId} onChange={(e)=>{setProductId(e.target.value)}} />
                <input type="text" placeholder="Name" className="input input-bordered w-full max-w-xs mb-4" value={name} onChange={(e)=>{setName(e.target.value)}} />
                <input type="text" placeholder="Alt Names (comma separated)" className="input input-bordered w-full max-w-xs mb-4" value={altNames} onChange={(e)=>{setAltNames(e.target.value)}} />
                <input placeholder="Description" className="textarea textarea-bordered w-full max-w-xs mb-4" value={description} onChange={(e)=>{setDescription(e.target.value)}}></input>
                <input type="file" placeholder="Images" multiple className="input input-bordered w-full max-w-xs mb-4" onChange={(e)=>{setImages(e.target.files)}} />
                <input type="number" placeholder="Labelled Price" className="input input-bordered w-full max-w-xs mb-4" value={labelledPrice} onChange={(e)=>{setLabelledPrice(e.target.value)}} />
                <input type="number" placeholder="Price" className="input input-bordered w-full max-w-xs mb-4" value={price} onChange={(e)=>{setPrice(e.target.value)}} />
                <input type="number" placeholder="Stock" className="input input-bordered w-full max-w-xs mb-4" value={stock} onChange={(e)=>{setStock(e.target.value)}} />
                <div>
                    <Link to="/admin/products" className="bg-red-500 text-white font-bold py-2 px-4 rounded mr-4">Back</Link>
                    {/* <button onClick={addProduct} className="bg-green-500 text-white font-bold py-2 px-4">Add Product</button> */}
                    <button onClick={updateProduct} className="bg-cyan-500 text-white font-bold py-2 px-4 rounded mr-4">Update Product</button>
                </div>
            </div>
        )
    }