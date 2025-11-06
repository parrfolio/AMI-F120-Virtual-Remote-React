import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createAccount,
  loginWithEmail,
  loginWithGoogle,
  loginWithFacebook,
  loginWithTwitter,
  loginWithApple,
} from "@/lib/auth";
import AmiMusicLogo from "@/js/components/Assets/AmiMusicLogo.png";

export const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        await createAccount(email, password, firstName, lastName);
      } else {
        await loginWithEmail(email, password);
      }
      navigate("/songs");
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (
    provider: "google" | "facebook" | "twitter" | "apple"
  ) => {
    setError("");
    setLoading(true);

    try {
      switch (provider) {
        case "google":
          await loginWithGoogle();
          break;
        case "facebook":
          await loginWithFacebook();
          break;
        case "twitter":
          await loginWithTwitter();
          break;
        case "apple":
          await loginWithApple();
          break;
      }
      navigate("/songs");
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white to-jukebox-bg relative overflow-hidden">
      {/* Background decorative dots */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Header with Red Background */}
      <div className="bg-jukebox-red h-32 sm:h-40 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={AmiMusicLogo}
            alt="AMi Music Logo"
            className="h-20 sm:h-24 w-auto object-contain"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-fluid-3xl font-metropolis-bold text-jukebox-black mb-2">
                Jukebox Remote
              </h1>
              <h2 className="text-fluid-xl font-metropolis-bold text-jukebox-black">
                Login
              </h2>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl text-fluid-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
              {isSignUp && (
                <>
                  <div>
                    <label className="block text-fluid-sm font-metropolis text-jukebox-gray mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-4 bg-jukebox-bg border-2 border-transparent rounded-2xl focus:outline-none focus:border-jukebox-red focus:bg-white transition-all text-fluid-base font-metropolis"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-fluid-sm font-metropolis text-jukebox-gray mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-4 bg-jukebox-bg border-2 border-transparent rounded-2xl focus:outline-none focus:border-jukebox-red focus:bg-white transition-all text-fluid-base font-metropolis"
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-fluid-sm font-metropolis text-jukebox-gray mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 bg-jukebox-bg border-2 border-transparent rounded-2xl focus:outline-none focus:border-jukebox-red focus:bg-white transition-all text-fluid-base font-metropolis"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-fluid-sm font-metropolis text-jukebox-gray">
                    Password
                  </label>
                  {!isSignUp && (
                    <button
                      type="button"
                      className="text-fluid-sm text-jukebox-blue hover:underline font-metropolis"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  placeholder="************"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 bg-jukebox-bg border-2 border-transparent rounded-2xl focus:outline-none focus:border-jukebox-red focus:bg-white transition-all text-fluid-base font-metropolis"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-jukebox-red hover:bg-jukebox-red-dark text-white font-metropolis-bold py-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-fluid-lg shadow-lg mt-6"
              >
                {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Login"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-fluid-base font-metropolis text-jukebox-gray">
                  Or
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleSocialLogin("facebook")}
                disabled={loading}
                className="w-full bg-[#1877F2] hover:bg-[#0d6efd] text-white font-metropolis-bold py-4 rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-fluid-base shadow-lg"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Sign In with Facebook
              </button>

              <button
                onClick={() => handleSocialLogin("google")}
                disabled={loading}
                className="w-full bg-white hover:bg-gray-50 text-jukebox-gray border-2 border-gray-200 font-metropolis-bold py-4 rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-fluid-base shadow-lg"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign In with Google
              </button>

              <button
                onClick={() => handleSocialLogin("apple")}
                disabled={loading}
                className="w-full bg-black hover:bg-gray-900 text-white font-metropolis-bold py-4 rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-3 text-fluid-base shadow-lg"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Sign In with Apple
              </button>
            </div>

            {/* Toggle Sign Up / Login */}
            <div className="mt-8 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-fluid-sm text-jukebox-blue hover:underline font-metropolis"
              >
                {isSignUp
                  ? "Already have an account? Login"
                  : "Don't have an account? Sign Up"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-center mt-8 pb-8">
          <div className="inline-block bg-jukebox-red text-white px-8 py-4 rounded-full shadow-lg">
            <p className="text-fluid-lg font-metropolis-bold tracking-wider">
              1954 AMi F 120
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
