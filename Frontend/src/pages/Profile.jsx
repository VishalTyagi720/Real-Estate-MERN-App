// import React from 'react'

export default function Profile() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" >
        <img src=""alt="profile-photo" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"/>
        <input type="text" placeholder="username" className="border p-3 rounded-lg" id="username"></input>
        <input type="email" placeholder="email" className="border p-3 rounded-lg" id="email"></input>
        <input type="password" placeholder="password" className="border p-3 rounded-lg" id="password"></input>
        <button className="bg-slate-700 text-white rounded-lg p-3 w-28 sm:w-56 mx-auto uppercase hover:opacity-95 disabled:opacity-60">update</button>
      </form>
      <div className="flex justify-between mt-4">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-600 cursor-pointer">Sign out</span>
      </div>
      </div>
  )
}

