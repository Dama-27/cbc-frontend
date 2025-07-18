import { Link, Route, Routes } from "react-router-dom";
import AddProductPage from "./admin/addProductPage";
import AdminProductsPage from "./admin/ProductsPage";

export default function AdminPage(){
    return(
        <div className="w-full h-screen flex">
            <div className="h-full w-[300px] flex flex-col" >
                <Link to="/admin/products">Products</Link>
                <Link to="/admin/users">Users</Link>
                <Link to="/admin/orders">Orders</Link>
                <Link to="/admin/reviews">Reviews</Link>
                <Link to="/admin/products">Products</Link>


            </div>
            <div className="h-full w-[calc(100%-300px)]">
                <Routes path="/">
                    <Route path="/products" element={<AdminProductsPage />}/>
                    <Route path="/users" element={<h1>Users</h1>}/>
                    <Route path="/orders" element={<h1>Orders</h1>}/>
                    <Route path="/reviews" element={<h1>Reviews</h1>}/>
                    <Route path="/addProduct" element={<AddProductPage/>}/>
                    <Route path="/editProduct/:productId" element={<AddProductPage/>}/>
                </Routes>
            </div>
        </div>
    )
}