import {GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';


function OAuth() {

    const dispatch = useDispatch();
    const Navigate = useNavigate();

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            // console.log(result)

            const response = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            })
            // console.log(response)
            const data = await response.json();
            // console.log(data);
            if (data.success === true){
                dispatch(signInSuccess(data));
                Navigate('/');
            }else {
                alert('try again later')
            }

        } catch (error) {
            console.log("Could not sign in with google", error);
        }
    }

    return (
        <button onClick={handleGoogleClick} type="button" className="bg-red-600 text-white p-3 w-28 sm:w-56 mx-auto rounded-lg uppercase hover:opacity-90">GOOGLE</button>
    )
}


// function OAuthSignup() {

//     const Navigate = useNavigate();

//     const handleGoogleClick = async () => {
//         try {
//             const provider = new GoogleAuthProvider();
//             const auth = getAuth(app);

//             const result = await signInWithPopup(auth,provider);
//             // console.log(result)

//             const response = await fetch('/api/auth/googlesignup', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     name: result.user.displayName,
//                     email: result.user.email,
//                     photo: result.user.photoURL
//                 }),
//             })
//             const data = await response.json();
//             if (data.success === false) {
//                 alert('Something went wrong.. Try again')
//             }else {
//                 Navigate('/')
//             }

//         } catch (error) {
//             console.log("Could not sign up with google", error);
//         }
//     }

//     return (
//         <button onClick={handleGoogleClick} type="button" className="bg-red-600 text-white p-3 w-28 sm:w-56 mx-auto rounded-lg uppercase hover:opacity-90">GOOGLE</button>
//     )
// }



export {OAuth}