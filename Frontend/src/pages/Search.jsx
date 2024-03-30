



export default function Search() {
  return (
    <div className="flex flex-col md:flex-row">
        <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
            <form className="flex flex-col gap-8">
                <div className="flex items-center gap-2 ">
                    <label htmlFor="searchTerm" className="whitespace-nowrap font-semibold">Search Term: </label>
                    <input type="text" name="searchTerm" id="searchTerm" placeholder="Search..." className="border rounded-lg p-3 w-full"/>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <label htmlFor="" className="font-semibold">Type:</label>
                    <div className="flex gap-2">
                        <input type="checkbox" id="all" className="w-5"/>
                        <span>Rent & Sale</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="rent" className="w-5"/>
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="sale" className="w-5"/>
                        <span>Sale</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="offer" className="w-5"/>
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <label htmlFor="" className="font-semibold">Amenities:</label>
                    <div className="flex gap-2">
                        <input type="checkbox" id="parking" className="w-5"/>
                        <span>Parking</span>
                    </div>
                    <div className="flex gap-2">
                        <input type="checkbox" id="furnished" className="w-5"/>
                        <span>Furnished</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <label htmlFor="sort_order" className="font-semibold">Sort: </label>
                    <select name="" id="sort_order" className="border rounded-lg p-2">
                        <option value="">Price High to Low</option>
                        <option value="">Price Low to High</option>
                        <option value="">Latest</option>
                        <option value="">Oldest</option>
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
