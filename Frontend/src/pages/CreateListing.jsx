
import { useState } from "react";
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from "../firebase";



export default function CreateListing() {

    const [files, setFiles] = useState([]);
    // console.log(files);
    const [formData, setformData] = useState({
        imageUrls: [],
    });
    // console.log(formData)
    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);


    const handleImageSubmit = () => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false)
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises).then((urls) => {
                setformData({...formData, imageUrls: formData.imageUrls.concat(urls)});
                setImageUploadError(false);

            }).catch(() => {
                setImageUploadError('Image uploading failed (file size should be < 2 MB per image)');
                setUploading(false);
            })
        }
        // if (files.length == 0){
        //     setImageUploadError('Minimum 1 image is required')
        // }
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
        setformData({...formData, imageUrls: formData.imageUrls.filter((_, i) => i !== index)})
    };
    

    return (
        <main className="p-3 max-w-4xl mx-auto flex flex-col gap-6">
            <h1 className="text-3xl font-semibold text-center my-7"> Create a Listing </h1>
            <form className="flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-4 flex-1">
                    <input type="text" placeholder="Name" className="border p-3 rounded-lg" id="name" maxLength='62'minLength='10' required></input>
                    <textarea type="text" placeholder="Description" className="border p-3 rounded-lg" id="description" required></textarea>
                    <input type="text" placeholder="Address" className="border p-3 rounded-lg" id="address" required></input>

                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input type="checkbox" id="sale" className="w-5"></input>
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="rent" className="w-5"></input>
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="parking" className="w-5"></input>
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="furnished" className="w-5"></input>
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="offer" className="w-5"></input>
                            <span>Offer</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <input className="p-3 border border-gray-300 rounded-lg" type="number" id="bedrooms" min='1' max='10' required></input>
                            <p>Beds</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input className="p-3 border border-gray-300 rounded-lg" type="number" id="bathrooms" min='1' max='10' required></input>
                            <p>Baths</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <input className="p-3 border border-gray-300 rounded-lg" type="number" id="regularPrice" min='1' max='10' required></input>
                            <div className="flex flex-col items-center">
                                <p>Regular Price</p>
                                <span className="text-xs">($ / Month)</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input className="p-3 border border-gray-300 rounded-lg" type="number" id="discountedPrice" min='1' max='10' required></input>
                            <div className="flex flex-col items-center">
                                <p>Discounted Price</p>
                                <span className="text-xs">($ / Month)</span>
                            </div>
                        </div>
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

                    {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => {
                        return (
                            <div key={url} className="flex justify-between p-3 border items-center">
                                <img src={url} alt="listing-image" className="w-20 h-20 object-contain rounded-lg"/>
                                <button type="button" onClick={() => handleRemoveImage(index)} className="p-3 text-red-700 rounded-lg uppercase hover:opacity-80">Delete</button>
                            </div>
                        )
                    })}

                    <button className="p-4 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">Create Listing</button>
                </div>
            </form>
        </main>
    )
}
