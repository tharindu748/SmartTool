import { AiOutlineGoogle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getAuth } from "firebase/auth"; // Import getAuth from Firebase Authentication
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice"; // Import the signInSuccess action
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

export default function OAuth() {
  const auth = getAuth(app); // Initialize Firebase Authentication
  const dispatch = useDispatch(); // Initialize useDispatch hook
  const Navigate = useNavigate(); // Initialize useNavigate hook

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });

    try {
      const resultsFromGoogle = await signInWithPopup(auth, provider);
      const res = await fetch('api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName || "GoogleUser",
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL || "https://example.com/default.jpg",
        }),
      });
      

      const data = await res.json();

      if (data.success === false) {
        console.error("Google Sign-In Error:", data.message); // ❗ Fix: replaced setErrorMessage with console.error
        return;
      }

      if (res.ok) {
        dispatch(signInSuccess(data)); // Dispatch the sign-in success action with the user data
        Navigate('/');
      }
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  return (
    <button
      type="button"
      className="flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
      onClick={handleGoogleClick}
    >
      {/* Google Icon */}
      <AiOutlineGoogle className="w-5 h-5 mr-2" />
      Continue with Google
    </button>
  );
}
