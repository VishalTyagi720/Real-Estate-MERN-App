// import React from 'react'
import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signinSuccess, signInFailure } from '../redux/user/userSlice';



export default function SignIn() {

  const [formData, setFormData] = useState({});
  const {loading, error} = useSelector((state) => state.user);
  const Navigate = useNavigate();
  const dispatch = useDispatch();


  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      // using proxy. every time we hit the url, localhost:3000 is added in the beginning
      const response = await fetch('/api/auth/signin', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      // console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signinSuccess(data));
      Navigate('/')
    } 
    catch (error) {
      dispatch(signInFailure(error.message));
    }
  }


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-bold my-7 uppercase">Sign In</h1>
      <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
        {/* <input type='text' placeholder='Username' className='border p-3 rounded-lg' id='username' onChange={handleChange}></input> */}
        <input type='email' placeholder='Email' className='border p-3 rounded-lg' id='email' onChange={handleChange}></input>
        <input type='password' placeholder='Password' className='border p-3 rounded-lg' id='password' onChange={handleChange}></input>
        <button disabled={loading} className="bg-slate-900 text-white p-3 w-28 sm:w-56 mx-auto rounded-lg uppercase hover:opacity-90 disabled:opacity-60">
          {loading ? 'Loading...' : 'Sign In'}
        </button>
      </form>
      <div className="flex gap-3 mt-3">
        <p> Don&apos;t have an account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-700 font-medium'>Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-600 mt-4'>{error}</p>}
    </div>
  )
}

