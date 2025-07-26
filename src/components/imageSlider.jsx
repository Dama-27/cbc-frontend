import { useState } from "react"

export default function ImageSlider(props){

    const images = props.images
    const [currentIndex, setCurrentIndex] = useState(0)

    return(
        <div className="w-[500px] h-[600px]">
            <img className="w-full h-[500px] object-cover rounded-3xl" src={images[currentIndex]}/>
            <div className="w-full h-[100px] flex justify-center items-center">
                {
                    images?.map(
                        (image,index)=>{
                            return(
                                <img key={index} className={"w-[90px] h-[90px] rounded-2xl object-cover cursor-pointer mx-2 hover:border-2 hovera border-accent-color "+(index==currentIndex&&"border-accent border-2")} src={image} 
                                onClick={
                                    ()=>setCurrentIndex(index)
                                }/>
                            )
                        }

                    )
                }

            </div>

        </div>
    )


}