export default function HomePage(){
    return(
        <div className='w-full h-screen bg-gray-100 flex justify-center items-center'>
            <div className='w-[400px] h-[500px] bg-white shadow-lg rounded-lg p-8'>
                <h1 className='text-2xl font-bold mb-6 text-center'>Welcome to the Home Page</h1>
                <p className='text-gray-700'>This is the home page of our application.</p>
            </div>
        </div>
    )
}