import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';

const AdminLoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        rememberMe: false,
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const isAuth = localStorage.getItem('isAdminAuthenticated');
        if (isAuth) {
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Simple mock authentication
        if (formData.username === 'madgee' && formData.password === '1234') {
            localStorage.setItem('isAdminAuthenticated', 'true');
            navigate('/admin/dashboard');
        } else {
            setError('Invalid username or password');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <h1 className="font-heading text-3xl font-bold text-primary mb-2">
                            MAGDEE
                        </h1>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">ADMIN ACCESS</h2>
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 bg-accent bg-opacity-10 rounded-full flex items-center justify-center">
                                <Lock size={32} className="text-accent" />
                            </div>
                        </div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <Input
                            label="Username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter your username"
                            icon={User}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            icon={Lock}
                            required
                        />

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                                Remember me
                            </label>
                        </div>

                        <Button type="submit" variant="primary" className="w-full">
                            LOGIN
                        </Button>
                    </form>

                    {/* Security Message */}
                    <p className="mt-6 text-center text-xs text-gray-500">
                        Authorized personnel only
                    </p>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600 font-semibold mb-2">Demo Credentials:</p>
                        <p className="text-xs text-gray-600">Username: <code className="bg-white px-2 py-1 rounded">madgee</code></p>
                        <p className="text-xs text-gray-600">Password: <code className="bg-white px-2 py-1 rounded">1234</code></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLoginPage;
