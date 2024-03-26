import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {Swiper, SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';



export default function Listing() {

    SwiperCore.use([Navigation])
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const Params = useParams();

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true)
                const response = await fetch(`/api/listing/get/${Params.listingId}`);
    
                const data = await response.json();
                if (data.success === false) {
                    setError(true)
                    setLoading(false)
                    return;
                }
                // console.log(data.data)
                setListing(data.data);
                setLoading(false)
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false)
            }
        };

        fetchListing();
    }, [Params.listingId])


    return (
        <main> 
            {loading && <p className="text-center text-2xl my-7 font-bold">Loading...</p>}
            {error && <p className="text-center text-2xl my-7 font-bold">Something went wrong!!</p>}
            {listing && !loading && !error && (
                <div>
                    <Swiper navigation>
                        {listing.imageURLs.map((url) => (
                            <SwiperSlide key={url}>
                                <div className="h-[500px]" style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover'}}></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </main>
    )
}
