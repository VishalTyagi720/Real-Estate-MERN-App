import {FaSearch} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
 
function Header() {

    const {currentUser} = useSelector(state => state.user)
    const [searchTerm, setSearchTerm] = useState('')
    const Navigate = useNavigate();


    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm)
        const searchQuery = urlParams.toString();
        Navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm')
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl)
        }
    }, [location.search]);


    return (
        <header className="bg-zinc-300 shadow-md">
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3 h-24">
                <Link to='/'>
                    <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                        <span className="text-slate-500 text-2xl">Real</span>
                        <span className="text-slate-700 text-2xl">Estate</span>
                    </h1>
                </Link>
                <form onSubmit={handleSubmit} className="bg-slate-100 p-3 rounded-lg flex items-center">
                    <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent focus:outline-none w-24 sm:w-64" />
                    <button>
                        <FaSearch className='text-slate-600'/>
                    </button>
                </form>
                <ul className='flex gap-5 font-bold' >
                    <Link to='/'><li className='hidden sm:inline hover:underline text-slate-700'>HOME</li></Link>
                    <Link to='/about'><li className='hidden sm:inline hover:underline text-slate-700'>ABOUT</li></Link>
                    <Link to='/profile'>
                        {currentUser ? (
                            <img className='rounded-full h-7 w-7 object-cover' src={currentUser.data.avatar} alt='profile_image'/>
                        ) : (
                            <li className='hover:underline text-slate-700'>SIGN IN</li>
                        )}
                    </Link>
                </ul>
            </div>
        </header>
    )
}


export default Header;
