import { useState } from "react";
import ErrorPopup from "./ErrorPopup";
import Toast from "./Toast";
import { Eye, EyeOff } from "lucide-react";

interface SignupFormProps {
  onRegister: (username: string, email: string, password: string) => Promise<void>;
  onBack: () => void;
}

function SignupForm({ onRegister, onBack }: SignupFormProps) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !email || !password) {
            setError('Please fill in all fields');
            setShowErrorPopup(true); 
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            setShowErrorToast(true); 
            return;
        }

        setLoading(true);
        setError('');

        try {
            await onRegister(username, email, password);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            setError(errorMessage);
            setShowErrorPopup(true); 
        } finally {
            setLoading(false);
        }
    };

    const closeErrorPopup = () => {
        setShowErrorPopup(false);
        setError('');
    };

    const closeErrorToast = () => {
        setShowErrorToast(false);
        setError('');
    };

    return (
        <>
            <div className="min-h-screen bg-rose-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-pink-800">Join Us!</h2>
                        <p className="text-gray-600">Create your new account</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 border border-pink-300 rounded-lg"
                            disabled={loading}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-pink-300 rounded-lg"
                            disabled={loading}
                        />
                        <div className="flex align-center">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password (min 8 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border border-pink-300 rounded-lg"
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="m-[-2rem] transparent border-none cursor-pointer"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-500 text-white p-3 rounded-lg font-medium hover:bg-green-600 disabled:opacity-50"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center space-y-2">
                        <button
                            onClick={onBack}
                            className="text-gray-500 hover:underline text-sm"
                            disabled={loading}
                        >
                            Back to start
                        </button>
                    </div>
                </div>
            </div>

            {/* Error Popup - for serious errors like API failures */}
            <ErrorPopup
                message={error}
                isVisible={showErrorPopup}
                onClose={closeErrorPopup}
                duration={0} 
            />

            {/* Error Toast - for validation errors */}
            <Toast
                message={error}
                type="error"
                isVisible={showErrorToast}
                onClose={closeErrorToast}
                duration={3000}
                position="top-center"
            />
        </>
    );
}
export default SignupForm