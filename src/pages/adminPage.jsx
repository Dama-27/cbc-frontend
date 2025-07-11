import { Link, Route, Routes } from "react-router-dom";
import AdminProductsPage from "./admin/AdminProductsPage";
import AddProductPage from "./admin/addProduct";

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
                </Routes>
            </div>
        </div>
    )
}