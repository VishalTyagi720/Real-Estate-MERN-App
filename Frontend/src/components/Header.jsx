import {FaSearch} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
 
function Header() {

    const {currentUser} = useSelector(state => state.user)

    return (
        <header className="bg-zinc-300 shadow-md">
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3 h-24">
                <Link to='/'>
                    <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                        <span className="text-slate-500 text-2xl">Real</span>
                        <span className="text-slate-700 text-2xl">Estate</span>
                    </h1>
                </Link>
                <form className="bg-slate-100 p-3 rounded-lg flex items-center">
                    <input type="text" placeholder="Search..." className="bg-transparent focus:outline-none w-24 sm:w-64" />
                    <FaSearch className='text-slate-600'/>
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
