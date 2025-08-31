import { Link, Route, Routes, useLocation } from "react-router-dom";
import AddProductPage from "./admin/addProductPage";
import EditProductPage from "./admin/editProductPage";
import AdminProductsPage from "./admin/productsPage";
import AdminOrdersPage from "./admin/adminOrdersPage";

export default function AdminPage(){
    const location = useLocation();
    const path = location.pathname;

    function getClass(name){
        if(path.includes(name)){
            return "bg-accent text-white p-3"
        }
        else{
            return "text-accent p-3"
        }

    }

    return(
        <div className="w-full h-screen flex bg-accent overflow-hidden">
            <div className="h-full w-[300px] text-accent font-bold text-xl flex flex-col bg-white" >
                <Link className={getClass("products")} to="/admin/products">Products</Link>
                <Link className={getClass("users")} to="/admin/users">Users</Link>
                <Link className={getClass("orders")} to="/admin/orders">Orders</Link>
                <Link className={getClass("reviews")} to="/admin/reviews">Reviews</Link>
                {/* <Link className={getClass("products")} to="/admin/products">Products</Link> */}


            </div>
            <div className="h-full w-[calc(100%-300px)] border-accent border-4 rounded-xl bg-white">
                <Routes path="/">
                    <Route path="/products" element={<AdminProductsPage />}/>
                    <Route path="/users" element={<h1>Users</h1>}/>
                    <Route path="/orders" element={<AdminOrdersPage />}/>
                    <Route path="/reviews" element={<h1>Reviews</h1>}/>
                    <Route path="/addProduct" element={<AddProductPage/>}/>
                    <Route path="/editProduct" element={<EditProductPage/>}/>
                </Routes>
            </div>
        </div>
    )
}