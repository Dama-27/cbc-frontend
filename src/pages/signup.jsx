export default function SignUp() {
    return(
        <div className='w-full h-screen bg-gray-100 flex justify-center items-center'>
            <div className='w-[400px] h-[500px] bg-white shadow-lg rounded-lg p-8'>
                <h1 className='text-2xl font-bold mb-6 text-center'>Sign Up</h1>
                <form>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium mb-2' htmlFor='name'>Name</label>
                        <input type='text' id='name' className='w-full p-2 border border-gray-300 rounded' placeholder='Enter your name' />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium mb-2' htmlFor='email'>Email</label>
                        <input type='email' id='email' className='w-full p-2 border border-gray-300 rounded' placeholder='Enter your email' />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium mb-2' htmlFor='password'>Password</label>
                        <input type='password' id='password' className='w-full p-2 border border-gray-300 rounded' placeholder='Enter your password' />
                    </div>
                    <button type='submit' className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700'>Sign Up</button>
                </form>
            </div>
        </div>
    )
}
