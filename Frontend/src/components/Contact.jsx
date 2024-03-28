/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";




export default function Contact({ listing }) {

    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');


    useEffect(() => {
        const fetchLandLord = async () => {
            try {
                const response = await fetch(`/api/user/${listing.userRef}`);
                const data = await response.json();
                setLandlord(data.data)
                // console.log(data.data)
            } catch (error) {
                console.log(error)
            }
        }

        fetchLandLord();

    }, [listing.userRef])
    
    return (
        <>
            {landlord && (
                <div className="flex flex-col gap-2">
                    <p>
                        Contact <span className="font-semibold">{landlord.username}</span> for <span className="font-semibold">{listing.name.toLowerCase()}</span>
                    </p>
                        <textarea className="w-full border p-3 rounded-lg" placeholder="Enter your message here..." name="message" id="message" rows="2" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                        <Link to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`} className="bg-slate-700 text-white my-3 text-center p-3 uppercase rounded-lg hover:opacity-90">Send Message</Link>
                </div>
            )}
        </>
    )
}
