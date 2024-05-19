
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {Swiper, SwiperSlide} from 'swiper/react';
import { Navigation } from "swiper/modules";
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItems from "../components/ListingItems";


export default function Home() {

  SwiperCore.use([Navigation])
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  console.log(offerListings);
  console.log(saleListings);
  console.log(rentListings);


  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const response = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await response.json();
        setOfferListings(data.data)
        // console.log(data.data)
        fetchRentListings();
      } catch (error) {
        console.log(error)
      }
    }

    const fetchRentListings = async () => {
      try {
        const response = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await response.json();
        setRentListings(data.data)
        // console.log(data.data)
        fetchSaleListings();
      } catch (error) {
        console.log(error)
      }
    };

    const fetchSaleListings = async () => {
      try {const response = await fetch('/api/listing/get?type=sale&limit=4');
      const data = await response.json();
      setSaleListings(data.data);
        // console.log(data.data)
      } catch (error) {
        console.log(error)
      }
    };

    fetchOfferListings();
  }, [])

  return (
    <div>
      <div className=" flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span> <br/>place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Real Estate is the best place to find your next perfect place to live.<br/> Our expert support are always available. 
        </div>
        <Link to={'/search'} className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"> Let&apos;s get started...</Link>
      </div>

      <Swiper navigation>
        {offerListings && offerListings.length > 0 && offerListings.map((listing) => (
          <SwiperSlide key={listing._id}>
            <div className="h-[500px]" style={{background:`url(${listing.imageURLs[0]}) center no-repeat`, backgroundSize: 'cover'}}></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent Offers</h2>
              <Link to={'/search?offer=true'} className="text-sm text-blue-800 hover:underline">Show more offers</Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListings.map((listing) => (
                <ListingItems listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent places for rent</h2>
              <Link to={'/search?type=rent'} className="text-sm text-blue-800 hover:underline">Show more places for rent</Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListings.map((listing) => (
                <ListingItems listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">Recent places for sale</h2>
              <Link to={'/search?type=sale'} className="text-sm text-blue-800 hover:underline">Show more places for sale</Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListings.map((listing) => (
                <ListingItems listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>

  )
}


