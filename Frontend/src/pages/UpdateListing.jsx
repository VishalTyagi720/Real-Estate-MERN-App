
import { useEffect, useState } from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from "../firebase";
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";



export default function CreateListing() {
    const { currentUser } = useSelector((state) => state.user)
    const Navigate = useNavigate();
    const Params = useParams();

    const [files, setFiles] = useState([]);
    const [formData, setformData] = useState({
        imageURLs: [],
        name: "",
        description: "",
        address: "",
        type: "rent",
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [Error, setError] = useState(false);
    const [Loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {
            const listingId = Params.listingId
            // console.log(listingId)
            const response = await fetch(`/api/listing/get/${listingId}`);
            const data = await response.json()
            if (data.success === false) {
                console.log(data.message)
                return;
            }
            setformData(data.data)
        }

        fetchListing();
    }, []);


    const handleImageSubmit = () => {
        if (files.length > 0 && files.length + formData.imageURLs.length < 7) {
            setUploading(true);
            setImageUploadError(false)
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setformData({...formData, imageURLs: formData.imageURLs.concat(urls)});
                setImageUploadError(false);
                setUploading(false)

            }).catch(() => {
                setImageUploadError('Image uploading failed (file size should be < 2 MB per image)');
                setUploading(false);
            })
        }
        else {
            setImageUploadError('You can only upload 6 images per Listing');
            setUploading(false);
        }
    };

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log(`Upload is ${progress}% done`);
            },
            () => {
            reject(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                })
            });
        });
    };

    const handleRemoveImage = (index) => {
        setformData({...formData, imageURLs: formData.imageURLs.filter((_, i) => i !== index)})
    };
    
    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setformData({...formData, type: e.target.id})
        }

        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setformData({...formData, [e.target.id] : e.target.checked})
        }

        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setformData({...formData, [e.target.id]: e.target.value});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageURLs.length < 1) return setError('Minimum one image is required')
            if (+formData.regularPrice < +formData.discountPrice) return setError('Discount price must be lower than the regular price')
            setLoading(true);
            setError(false);
            const response = await fetch(`/api/listing/update/${Params.listingId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser.data._id,
                }),
            });

            const data = await response.json();
            setLoading(false)
            if (data.success === false) {
                setError(data.message)
            }
            Navigate(`/listing/${data.data._id}`)
            
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };


    return (
        <main className="p-3 max-w-4xl mx-auto flex flex-col gap-6">
            <h1 className="text-3xl font-semibold text-center my-7"> Update a Listing </h1>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-4 flex-1">
                    <input onChange={handleChange} value={formData.name} type="text" placeholder="Name" className="border p-3 rounded-lg" id="name" maxLength='62'minLength='10' required></input>
                    <textarea onChange={handleChange} value={formData.description} type="text" placeholder="Description" className="border p-3 rounded-lg" id="description" required></textarea>
                    <input onChange={handleChange} value={formData.address} type="text" placeholder="Address" className="border p-3 rounded-lg" id="address" required></input>

                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input type="checkbox" id="sale" className="w-5" onChange={handleChange} checked={formData.type === 'sale'}></input>
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="rent" className="w-5" onChange={handleChange} checked={formData.type === 'rent'}></input>
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="parking" className="w-5" onChange={handleChange} checked={formData.parking}></input>
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="furnished" className="w-5" onChange={handleChange} checked={formData.furnished}></input>
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="offer" className="w-5" onChange={handleChange} checked={formData.offer}></input>
                            <span>Offer</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input onChange={handleChange} checked={formData.bedrooms} className="p-3 border border-gray-300 rounded-lg" type="number" id="bedrooms" min='1' max='10' required></input>
                            <p>Beds</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input onChange={handleChange} checked={formData.bathrooms} className="p-3 border border-gray-300 rounded-lg" type="number" id="bathrooms" min='1' max='10' required></input>
                            <p>Baths</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input onChange={handleChange} checked={formData.regularPrice} className="p-3 border border-gray-300 rounded-lg" type="number" id="regularPrice" min='50' max='1000000' required></input>
                            <div className="flex flex-col items-center">
                                <p>Regular Price</p>
                                <span className="text-xs">($ / Month)</span>
                            </div>
                        </div>
                        {formData.offer && (
                        <div className="flex items-center gap-2">
                            <input onChange={handleChange} checked={formData.discountPrice} className="p-3 border border-gray-300 rounded-lg" type="number" id="discountPrice" min='0' max='1000000' required></input>
                            <div className="flex flex-col items-center">
                                <p>Discounted Price</p>
                                <span className="text-xs">($ / Month)</span>
                            </div>
                        </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col flex-1 gap-6">
                    <p className="font-semibold">Images:
                    <span className="font-normal text-gray-600 ml-2">The first image by default will be the cover (max 6) :</span>
                    </p>
                    <div className=" flex gap-4">
                        <input onChange={(e) => setFiles(e.target.files)} className="p-3 border border-gray-300 rounded w-full" type="file" id="images" accept="image/*" multiple></input>
                        <button disabled={uploading} onClick={handleImageSubmit} type="button" className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80">{uploading ? 'Uploading...' : 'Upload'}</button>
                    </div>
                    <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p> {/*Add notification*/}

                    {formData.imageURLs.length > 0 && formData.imageURLs.map((url, index) => {
                        return (
                            <div key={url} className="flex justify-between p-3 border items-center">
                                <img src={url} alt="listing-image" className="w-20 h-20 object-contain rounded-lg"/>
                                <button type="button" onClick={() => handleRemoveImage(index)} className="p-3 text-red-700 rounded-lg uppercase hover:opacity-80">Delete</button>
                            </div>
                        )
                    })}

                    <button type="submit" disabled={Loading || uploading} className="p-4 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">{Loading ? 'Creating...' : 'Update Listing'}</button>
                    {Error && <p className="text-red-700 text-sm">{Error}</p>}
                </div>
            </form>
        </main>
    )
}
