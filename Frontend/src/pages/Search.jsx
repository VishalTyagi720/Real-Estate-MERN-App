import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";



export default function Search() {

    const [sidebardata, setSideBarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc',
    })
    // console.log(sidebardata);
    const Navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);
    console.log(listings)


    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm')
        const typeFromUrl = urlParams.get('type')
        const parkingFromUrl = urlParams.get('parking')
        const furnishedFromUrl = urlParams.get('furnished')
        const offerFromUrl = urlParams.get('offer')
        const sortFromUrl = urlParams.get('sort')
        const orderFromUrl = urlParams.get('order')

        if (searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
            setSideBarData({
                searchTerm : searchTermFromUrl || '',
                type : typeFromUrl || '',
                parking : parkingFromUrl === 'true' ? true : false,
                furnished : furnishedFromUrl === 'true' ? true : false,
                offer : offerFromUrl === 'true' ? true : false,
                sort : sortFromUrl || 'created_at',
                order : orderFromUrl || 'desc',
            })
        }

        const fetchListings = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const response = await fetch(`/api/listing/get?${searchQuery}`)
            // console.log(response)
            const data = await response.json();
            // console.log(data.data)
            setListings(data.data);
            setLoading(false);
        }

        fetchListings();

    },[location.search])


    const handleChange = (e) => {
        if (e.target.id === 'all'  || e.target.id === 'rent' || e.target.id === 'sale') {
            setSideBarData({...sidebardata, type: e.target.id})
        }

        if (e.target.id === 'searchTerm') {
            setSideBarData({...sidebardata, searchTerm: e.target.value})
        }

        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setSideBarData({...sidebardata, [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false})
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';

            setSideBarData({...sidebardata, sort, order})
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();

        urlParams.set('searchTerm', sidebardata.searchTerm)
        urlParams.set('type', sidebardata.type)
        urlParams.set('parking', sidebardata.parking)
        urlParams.set('furnished', sidebardata.furnished)
        urlParams.set('offer', sidebardata.offer)
        urlParams.set('sort', sidebardata.sort)
        urlParams.set('order', sidebardata.order)
        // console.log(sidebardata)
        const searchQuery = urlParams.toString();
        // console.log(searchQuery)
        Navigate(`/search?${searchQuery}`)
    };

    return (
        <div className="flex flex-col md:flex-row">
            <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                    <div className="flex items-center gap-2 ">
                        <label htmlFor="searchTerm" className="whitespace-nowrap font-semibold">Search Term: </label>
                        <input onChange={handleChange} value={sidebardata.searchTerm} type="text" name="searchTerm" id="searchTerm" placeholder="Search..." className="border rounded-lg p-3 w-full"/>
                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                        <label htmlFor="" className="font-semibold">Type:</label>
                        <div className="flex gap-2">
                            <input onChange={handleChange} checked={sidebardata.type === 'all'} type="checkbox" id="all" className="w-5"/>
                            <span>Rent & Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input onChange={handleChange} checked={sidebardata.type === 'rent'} type="checkbox" id="rent" className="w-5"/>
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input onChange={handleChange} checked={sidebardata.type === 'sale'} type="checkbox" id="sale" className="w-5"/>
                            <span>Sale</span>
                        </div>
                        <div className="flex gap-2">
                            <input onChange={handleChange} checked={sidebardata.offer} type="checkbox" id="offer" className="w-5"/>
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap items-center">
                        <label htmlFor="" className="font-semibold">Amenities:</label>
                        <div className="flex gap-2">
                            <input onChange={handleChange} checked={sidebardata.parking} type="checkbox" id="parking" className="w-5"/>
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-2">
                            <input onChange={handleChange} checked={sidebardata.furnished} type="checkbox" id="furnished" className="w-5"/>
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="sort_order" className="font-semibold">Sort: </label>
                        <select onChange={handleChange} defaultValue='created_at_desc' id="sort_order" className="border rounded-lg p-2">
                            <option value="regularPrice_desc">Price High to Low</option>
                            <option value="regularPrice_desc">Price Low to High</option>
                            <option value="createdAt_desc">Latest</option>
                            <option value="createdAt_asc">Oldest</option>
                        </select>
                    </div>
                    <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90">search</button>
                </form>
            </div>
            <div className="">
                <h1 className="text-3xl font-semibold p-3 border-b text-slate-800 mt-4">Listing Results:</h1>
            </div>
        </div>
    )
}
