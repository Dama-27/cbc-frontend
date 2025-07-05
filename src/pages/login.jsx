import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function handleLogin(){
        // console.log(email)
        // console.log(password)
        try{
            const response = await axios.post("http://localhost:3000/users/login",{
            email: email,
            password: password
            })
            // alert("Login successful")
            toast.success("Login successful")
            // console.log(response.data)
        }
        catch(e){
            // alert(e.response.data.message)
            toast.error(e.response.data.message)
        }
    }
        

    return(
        <div className='w-full h-screen bg-[url("/login.jpg")] bg-center bg-cover flex justify-evenly items-center '>
            <div className="w-[50%] h-full">

            </div>
            <div className="w-[50%] h-full flex justify-center items-center">
                <div className="w-[500px] h-[600px] backdrop-blur-md rounded-[50px] shadow-2xl flex flex-col justify-center items-center">
                    <input onChange={(e)=>{
                        setEmail(e.target.value)
                    }} 
                    value={email} className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[50px] my-[20px]"/>
                    <input onChange={(e)=>{
                        setPassword(e.target.value)
                    }} value={password} type="password" className="w-[300px] h-[50px] border border-[#c3efe9] rounded-[50px] my-[20px] mb-[20px]"/>
                    <button onClick={
                            handleLogin
                    } className="w-[300px] h-[50px] cursor-pointer bg-[#c3efe9] rounded-[50px] text-white font-bold ">Login</button>
                </div>
            </div>
            
        
        
            {/* <div className='w-[400px] h-[500px] bg-white shadow-lg rounded-lg p-8'>
                <h1 className='text-2xl font-bold mb-6 text-center'>Login</h1>
                <form>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium mb-2' htmlFor='email'>Email</label>
                        <input type='email' id='email' className='w-full p-2 border border-gray-300 rounded' placeholder='Enter your email' />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium mb-2' htmlFor='password'>Password</label>
                        <input type='password' id='password' className='w-full p-2 border border-gray-300 rounded' placeholder='Enter your password' />
                    </div>
                    <button type='submit' className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700'>Login</button>
                </form>
            </div> */}
        </div>
    )
}