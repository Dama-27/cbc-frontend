import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/header'
import ProductCard from './components/productCard'
import HomePage from './pages/home'
import LoginPage from './pages/login'
import AdminPage from './pages/adminPage'
import TestPage from './pages/testPage'
import { Toaster } from 'react-hot-toast'
import RegisterPage from './pages/register'
import AddProductPage from './pages/admin/addProductPage'


function App() {

  return (
    // <div className='w-full h-screen bg-red-100 flex flex-col justify-center items-center'>
    //   <div className='relative w-[650px] h-[650px] bg-red-900 flex flex-col justify-center items-center'>
    //     <div className='w-[600px] h-[600px] bg-green-500 flex flex-col justify-center items-center'>
    //       <div className='w-[100px] h-[100px] bg-blue-600 absolute bottom-[0px] right-[0px]'></div>
    //       {/* by using fixed we can move arbitary, we can use absolute also but fixed is powefull */}
    //       <div className='w-[100px] h-[100px] bg-green-600'></div>
    //       <div className='w-[100px] h-[100px] bg-yellow-600'></div>
    //       <div className='w-[100px] h-[100px] bg-purple-600'></div>
    //       <div className='w-[100px] h-[100px] bg-pink-600'></div>
    //       <div className='w-[100px] h-[100px] bg-orange-600'></div>
    //     </div>
    //   </div>
      
      
    //   {/* <Header/>
    //   <ProductCard name="dada dada dadad dada" description="lorem lorem lorem" price="$1000/=" picture={"https://picsum.photos/id/1/200/300"}/>
    //   <ProductCard name="Apple laptop" description="wadak na" price="1000/=" picture={"https://picsum.photos/id/2/200/300"}/>
    //   <ProductCard name="MSI laptop" description="wadak na" price="1000/=" picture={"https://picsum.photos/id/3/200/300"}/>
    //   <ProductCard/> */}
    // </div>
    <BrowserRouter>
      <div>
        {/* <Header/> */}
        <Toaster position='top-right'/>
        <Routes path="/*">
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/signup" element={<RegisterPage/>}/>
          <Route path="/testing" element={<TestPage/>}/>
          <Route path="/admin/*" element={<AdminPage/>}/>
          <Route path="/*" element={<HomePage/>} />
          
        </Routes>
      </div>
    </BrowserRouter>
    
  )
}

export default App
// https://cerlqnpkljgprpjwwfnb.supabase.co
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlcmxxbnBrbGpncHJwand3Zm5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NTE4MTIsImV4cCI6MjA2NzUyNzgxMn0.zUHXfAAuMDxmO79-epkBXu71i9yemcwnlUbzQQAkiEA
