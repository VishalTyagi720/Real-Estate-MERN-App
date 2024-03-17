import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from "../firebase";
import { updateUserStart, updateUserSuccess, updateUserFailure } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";



export default function Profile() {

  const {currentUser, loading, error} = useSelector((state) => state.user);
  // console.log(currentUser)
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setfilePercentage] = useState(0);
  const [fileUploadError, setfileUploadError] = useState(false);
  const [formData , setFormData] = useState({});
  // console.log(file)
  // console.log(formData)
  const dispatch = useDispatch();
  const [updateSuccess, setupdateSuccess] = useState(false);


  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    uploadTask.on('state_changed',
    (snapshot) => {
      // Observe state change events such as progress, pause, or resume
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setfilePercentage(Math.round(progress));
    },
    (error) => {
      setfileUploadError(true);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => setFormData({...formData, avatar: downloadURL}))
    });
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const response = await fetch(`/api/user/update/${currentUser.data._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success === false){
        dispatch(updateUserFailure(data.message))
        return;
      }
      dispatch(updateUserSuccess(data));
      setupdateSuccess(true);

    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  };


  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" >
        <input type="file" ref={fileRef} hidden accept="image/*" onChange={(e) => setFile(e.target.files[0])}/>
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.data.avatar} alt="profile-photo" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"/>
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Error Image Upload(image size less then 2MB)</span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePercentage}%`}</span>
          ) : filePercentage === 100 ? (
            <span className="text-green-700">Image successfully uploaded</span>
          ) : (
            ""
          )} 
        </p>
        <input type="text" placeholder="username" className="border p-3 rounded-lg" id="username" defaultValue={currentUser.data.username} onChange={handleChange}></input>
        <input type="email" placeholder="email" className="border p-3 rounded-lg" id="email" defaultValue={currentUser.data.email} onChange={handleChange}></input>
        <input type="password" placeholder="password" className="border p-3 rounded-lg" id="password" onChange={handleChange}></input>
        <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 w-28 sm:w-56 mx-auto uppercase hover:opacity-95 disabled:opacity-60">{loading ? 'loading...' : 'Update'}</button>
      </form>
      <div className="flex justify-between mt-4">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-600 cursor-pointer">Sign out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ''}</p>
      <p className="text-green-700 mt-5">{updateSuccess ? 'User details updated successfully' : ''}</p>
      </div>
  )
}

