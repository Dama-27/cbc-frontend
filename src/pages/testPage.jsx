import { createClient } from "@supabase/supabase-js"
import { useState } from "react"

export default function TestPage(){
    const [count, setCount] = useState(0)
    //count -> variable
    //setCount -> function -> used to change "count"

    //////use hooks on top of the function///
    //////hooks toka same widiyata load wenna one
    //////hooks run wena order eka alter karanna ba

    const [status, setStatus] = useState("Passed")
    //useState
    //useEffect
    //useNavigation
    //useParams
    //useLocation

    const [image,setImage]=useState(null)

    const url="https://cerlqnpkljgprpjwwfnb.supabase.co"
    const key="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlcmxxbnBrbGpncHJwand3Zm5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NTE4MTIsImV4cCI6MjA2NzUyNzgxMn0.zUHXfAAuMDxmO79-epkBXu71i9yemcwnlUbzQQAkiEA"

    const supabase = createClient(url,key)
    function fileUpload(){
        supabase.storage.from("images").upload(image.name,image,{
            upsert:false,
            cacheControl: '3600'
        }).then(
            ()=>{
                const publicUrl = supabase.storage.from("images").getPublicUrl(image.name).data.publicUrl
                console.log(publicUrl)
            }
        ).catch(
            (e)=>{
                console.log(e)
            }
        )
    }

    return(
        <div className="w-full h-screen flex justify-center items-center flex-col">
            <div className="w-[450px] h-[250px] shadow flex justify-center items-center">
                <button onClick={()=>{
                    setCount(count-1)
                }} className="bg-blue-600 text-white font-bold text-center w-[100px] h-[40px] text-[20px] cursor-pointer">
                    -
                </button>
                <span className="text-[50px] font-bold text-center w-[100px] h-[40px] mx-[10px] flex justify-center items-center">
                    {count}
                </span>
                <button onClick={()=>{
                    setCount(count+1)
                }} className="bg-blue-600 text-white font-bold text-center w-[100px] h-[40px] text-[20px] cursor-pointer">
                    +
                </button>
            </div>
            <div className="w-[450px] h-[250px] shadow flex flex-col justify-center items-center">
                <span className="text-[40px] font-bold text-center w-[100px] h-[40px] mx-[10px] flex justify-center  flext-col">
                    {status}
                </span>
                <div>
                    <button className="bg-blue-600 text-white font-bold text-center w-[100px] h-[40px] text-[20px] cursor-pointer m-[20px]"
                    onClick={()=>{
                        setStatus("Passed")
                    }}>
                        passed
                    </button>
                    <button  className="bg-blue-600 text-white font-bold text-center w-[100px] h-[40px] text-[20px] cursor-pointer  m-[20px]"
                    onClick={()=>{
                        setStatus("Failed")
                    }}>
                        Failed
                    </button>
                </div>
            </div>
            <div className="w-[450px] h-[250px] shadow flex justify-center items-center ">
                <input type="file" className="file-input file-input-bordered w-full max-w-xs"
                onChange={
                    (e)=>{
                        setImage(e.target.files[0])
                        // console.log(e.target.files[0])
                    }
                } />
                <button onClick={fileUpload} className="bg-green-600 text-white font-bold text-center w-[100px] h-[40px] text-[20px] cursor-pointer ml-[10px]">Upload</button>



            </div>
        </div>  
                

    )
}