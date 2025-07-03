import {Link} from 'react-router-dom';
import UserData from "./userData";
export default function Header(){
    return(
       <div className="bg-red-500">
        
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
        <h1 className="text-[30px] font-bold text-blue-700">crystal beauty clear</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi quod eum corporis placeat, inventore corrupti itaque labore amet ut doloremque autem accusamus dolores iure neque? Itaque rem et ex earum?</p>
        {/* <UserData></UserData> */}
       </div>
    )
}