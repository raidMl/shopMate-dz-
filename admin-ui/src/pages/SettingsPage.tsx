import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { usersAPI, siteConfigAPI, deliveryAPI } from '../services/api';
import Navbar from '../components/common/Navbar';

const SettingsPage: React.FC = () => {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState('profile');
    const [message, setMessage] = useState({ type: '', text: '' });
    
    // Config Data
    const [config, setConfig] = useState<any>(null);
    const [deliveryPrices, setDeliveryPrices] = useState<any>({});
    
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    // Site Config Form Data
    const [siteData, setSiteData] = useState({
        siteName: '',
        email: '',
        phone: '',
        logo: '',
        domain: '',
        description: '',
        address: '',
        city: '',
        wilaya: '',
        postalCode: '',
        facebook: '',
        instagram: '',
        tikTok: '',
        twitter: '',
        whatsapp: '',
        youtube: '',
        enableDomicile: true,
        enableBureau: true,
        freeShippingThreshold: 0,
        returnDays: 7,
        warranty: '',
        termsAndConditions: ''
    });

    useEffect(() => {
        fetchConfig();
        fetchDeliveryPrices();
    }, []);

    const fetchConfig = async () => {
        try {
            const response = await siteConfigAPI.getConfig();
            const data = response.data;
            setConfig(data);
            setSiteData({
                siteName: data.siteName || '',
                email: data.email || '',
                phone: data.phone || '',
                logo: data.logo || '',
                domain: data.domain || '',
                description: data.description || '',
                address: data.address || '',
                city: data.city || '',
                wilaya: data.wilaya || '',
                postalCode: data.postalCode || '',
                facebook: data.socialMedia?.facebook || '',
                instagram: data.socialMedia?.instagram || '',
                tikTok: data.socialMedia?.tikTok || '',
                twitter: data.socialMedia?.twitter || '',
                whatsapp: data.socialMedia?.whatsapp || '',
                youtube: data.socialMedia?.youtube || '',
                enableDomicile: data.shipping?.enableDomicile !== false,
                enableBureau: data.shipping?.enableBureau !== false,
                freeShippingThreshold: data.shipping?.freeShippingThreshold || 0,
                returnDays: data.policies?.returnDays || 7,
                warranty: data.policies?.warranty || '',
                termsAndConditions: data.policies?.termsAndConditions || ''
            });
        } catch (error) {
            console.error('Error fetching config:', error);
        }
    };

    const fetchDeliveryPrices = async () => {
        try {
            const response = await deliveryAPI.getPrices();
            setDeliveryPrices(response.data.prices || {});
        } catch (error) {
            console.error('Error fetching delivery prices:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        
        if (['name', 'currentPassword', 'newPassword', 'confirmNewPassword'].includes(name)) {
            setFormData(prev => ({ ...prev, [name]: val }));
        } else {
            setSiteData(prev => ({ ...prev, [name]: val }));
        }
    };

    const handleDeliveryPriceChange = (wilaya: string, type: 'domicile' | 'bureau', value: string) => {
        setDeliveryPrices((prev: any) => ({
            ...prev,
            [wilaya]: {
                ...prev[wilaya],
                [type]: parseInt(value) || 0
            }
        }));
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        
        try {
            await usersAPI.updateProfile({ name: formData.name });
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            storedUser.name = formData.name;
            localStorage.setItem('user', JSON.stringify(storedUser));
            setMessage({ type: 'success', text: 'Profile updated successfully' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || error.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        /* Lines 120-130 already exist */
        e.preventDefault();
        if (formData.newPassword !== formData.confirmNewPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }
        if (!formData.currentPassword || !formData.newPassword) {
            setMessage({ type: 'error', text: 'Current and new passwords are required' });
            return;
        }
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            if (!user?._id) throw new Error('User not found');
            await usersAPI.changeAdminPassword(user._id, { 
                currentPassword: formData.currentPassword, 
                newPassword: formData.newPassword 
            });
            setMessage({ type: 'success', text: 'Password changed successfully' });
            setFormData({ ...formData, currentPassword: '', newPassword: '', confirmNewPassword: '' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || error.message || 'Failed to change password' });
        } finally {
            setLoading(false);
        }
    };

    const handleSiteSubmit = async (section: string) => {
        if (!config?._id) return;
        setLoading(true);
        setMessage({ type: '', text: '' });
        
        try {
            let data: any = {};
            switch(section) {
                case 'basic':
                    data = {
                        siteName: siteData.siteName,
                        email: siteData.email,
                        phone: siteData.phone,
                        logo: siteData.logo,
                        domain: siteData.domain,
                        description: siteData.description
                    };
                    break;
                case 'address':
                    data = {
                        address: siteData.address,
                        city: siteData.city,
                        wilaya: siteData.wilaya,
                        postalCode: siteData.postalCode
                    };
                    break;
                case 'social':
                    data = {
                        socialMedia: {
                            facebook: siteData.facebook,
                            instagram: siteData.instagram,
                            tikTok: siteData.tikTok,
                            twitter: siteData.twitter,
                            whatsapp: siteData.whatsapp,
                            youtube: siteData.youtube
                        }
                    };
                    break;
                case 'shipping':
                    data = {
                        shipping: {
                            enableDomicile: siteData.enableDomicile,
                            enableBureau: siteData.enableBureau,
                            freeShippingThreshold: siteData.freeShippingThreshold
                        }
                    };
                    break;
                case 'policies':
                    data = {
                        policies: {
                            returnDays: siteData.returnDays,
                            warranty: siteData.warranty,
                            termsAndConditions: siteData.termsAndConditions
                        }
                    };
                    break;
            }
            
            await siteConfigAPI.update(config._id, data);
            setMessage({ type: 'success', text: `${section.charAt(0).toUpperCase() + section.slice(1)} settings updated successfully` });
            fetchConfig();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || error.message || 'Failed to update settings' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeliverySubmit = async () => {
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            await deliveryAPI.updateAllPrices(deliveryPrices);
            setMessage({ type: 'success', text: 'Delivery prices updated successfully' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || error.message || 'Failed to update delivery prices' });
        } finally {
            setLoading(false);
        }
    };

    const WILAYAS = [
        "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
        "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
        "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
        "31", "32", "33", "34", "35", "36", "37", "38", "39", "40",
        "41", "42", "43", "44", "45", "46", "47", "48", "49", "50",
        "51", "52", "53", "54", "55", "56", "57", "58"
    ];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Navbar />
            
            <main className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="mt-2 text-gray-600">Manage your account and shop preferences</p>
                </header>

                {message.text && (
                    <div className={`mb-6 p-4 rounded-md shadow-sm border ${message.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
                        {message.text}
                    </div>
                )}

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <nav className="space-y-1 bg-white shadow rounded-lg overflow-hidden">
                            {[
                                { id: 'profile', label: '👤 Profile', section: 'profile' },
                                { id: 'basic', label: '📋 Store Info', section: 'basic' },
                                { id: 'address', label: '📍 Address', section: 'address' },
                                { id: 'social', label: '📱 Social Media', section: 'social' },
                                { id: 'shipping', label: '🚚 Shipping', section: 'shipping' },
                                { id: 'delivery', label: '💰 Delivery Prices', section: 'delivery' },
                                { id: 'policies', label: '📜 Policies', section: 'policies' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                                        activeSection === item.id 
                                        ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600' 
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Content Section */}
                    <div className="flex-1 space-y-8">
                        {/* Profile & Password Section */}
                        {activeSection === 'profile' && (
                            <>
                                <section className="bg-white shadow rounded-lg overflow-hidden">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h2 className="text-xl font-semibold mb-4 text-indigo-700">Profile Information</h2>
                                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        disabled
                                                        className="mt-1 block w-full bg-gray-100 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-500 cursor-not-allowed"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <button type="submit" disabled={loading} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-md hover:from-indigo-700 hover:to-purple-700 font-medium transition shadow-md">
                                                    Update Profile
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </section>

                                <section className="bg-white shadow rounded-lg overflow-hidden">
                                     <div className="px-4 py-5 sm:p-6">
                                        <h2 className="text-xl font-semibold mb-4 text-indigo-700">Change Password</h2>
                                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                                                <input
                                                    type="password"
                                                    name="currentPassword"
                                                    value={formData.currentPassword}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                                                    <input
                                                        type="password"
                                                        name="newPassword"
                                                        value={formData.newPassword}
                                                        onChange={handleChange}
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                                                    <input
                                                        type="password"
                                                        name="confirmNewPassword"
                                                        value={formData.confirmNewPassword}
                                                        onChange={handleChange}
                                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end">
                                                <button type="submit" disabled={loading} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-md hover:from-indigo-700 hover:to-purple-700 font-medium transition shadow-md">
                                                    Change Password
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </section>
                            </>
                        )}

                        {/* Store Info Section */}
                        {activeSection === 'basic' && (
                            <section className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="px-4 py-5 sm:p-6">
                                    <h2 className="text-xl font-semibold mb-4 text-indigo-700">📋 Store Information</h2>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Store Name</label>
                                                <input type="text" name="siteName" value={siteData.siteName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Business Email</label>
                                                <input type="email" name="email" value={siteData.email} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                                <input type="text" name="phone" value={siteData.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Store Domain</label>
                                                <input type="text" name="domain" value={siteData.domain} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Logo URL</label>
                                            <input type="text" name="logo" value={siteData.logo} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                                            {siteData.logo && <img src={siteData.logo} alt="Logo Preview" className="mt-2 h-20 object-contain border p-1 rounded" />}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Description</label>
                                            <textarea name="description" value={siteData.description} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 h-24" />
                                        </div>
                                        <div className="flex justify-end">
                                            <button onClick={() => handleSiteSubmit('basic')} disabled={loading} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-md font-medium transition shadow-md">
                                                Save Basic Info
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Address Section */}
                        {activeSection === 'address' && (
                            <section className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="px-4 py-5 sm:p-6">
                                    <h2 className="text-xl font-semibold mb-4 text-indigo-700">📍 Address & Location</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Full Address</label>
                                            <input type="text" name="address" value={siteData.address} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                                        </div>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">City</label>
                                                <input type="text" name="city" value={siteData.city} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Wilaya (Code)</label>
                                                <select name="wilaya" value={siteData.wilaya} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
                                                    <option value="">Select Wilaya</option>
                                                    {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                                                <input type="text" name="postalCode" value={siteData.postalCode} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <button onClick={() => handleSiteSubmit('address')} disabled={loading} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-md font-medium transition shadow-md">
                                                Save Address
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Social Media Section */}
                        {activeSection === 'social' && (
                            <section className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="px-4 py-5 sm:p-6">
                                    <h2 className="text-xl font-semibold mb-4 text-indigo-700">📱 Social Media</h2>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {['facebook', 'instagram', 'tikTok', 'twitter', 'whatsapp', 'youtube'].map(social => (
                                            <div key={social}>
                                                <label className="block text-sm font-medium text-gray-700 capitalize">{social}</label>
                                                <input type="text" name={social} value={(siteData as any)[social]} onChange={handleChange} placeholder={`https://${social}.com/...`} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <button onClick={() => handleSiteSubmit('social')} disabled={loading} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-md font-medium transition shadow-md">
                                            Save Social Links
                                        </button>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Shipping Section */}
                        {activeSection === 'shipping' && (
                            <section className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="px-4 py-5 sm:p-6">
                                    <h2 className="text-xl font-semibold mb-4 text-indigo-700">🚚 Shipping Configuration</h2>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <label className="inline-flex items-center">
                                                <input type="checkbox" name="enableDomicile" checked={siteData.enableDomicile} onChange={handleChange} className="form-checkbox h-5 w-5 text-indigo-600" />
                                                <span className="ml-2 text-gray-700">Enable Home Delivery</span>
                                            </label>
                                            <label className="inline-flex items-center ml-6">
                                                <input type="checkbox" name="enableBureau" checked={siteData.enableBureau} onChange={handleChange} className="form-checkbox h-5 w-5 text-indigo-600" />
                                                <span className="ml-2 text-gray-700">Enable Desk/Office Pickup</span>
                                            </label>
                                        </div>
                                        <div className="max-w-xs">
                                            <label className="block text-sm font-medium text-gray-700">Free Shipping Threshold (DZD)</label>
                                            <input type="number" name="freeShippingThreshold" value={siteData.freeShippingThreshold} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                                            <p className="mt-1 text-xs text-gray-500">Set to 0 to disable free shipping.</p>
                                        </div>
                                        <div className="flex justify-end">
                                            <button onClick={() => handleSiteSubmit('shipping')} disabled={loading} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-md font-medium transition shadow-md">
                                                Save Shipping Config
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Delivery Prices Section */}
                        {activeSection === 'delivery' && (
                            <section className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-xl font-semibold text-indigo-700">💰 Delivery Prices by Wilaya</h2>
                                        <button onClick={handleDeliverySubmit} disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition shadow">
                                            Save All Prices
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto border rounded-lg max-h-[600px]">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50 sticky top-0">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wilaya</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domicile (DZD)</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bureau (DZD)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {WILAYAS.map(w => (
                                                    <tr key={w}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{w}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <input 
                                                                type="number" 
                                                                className="border rounded px-2 py-1 w-24" 
                                                                value={deliveryPrices[w]?.domicile || 0} 
                                                                onChange={(e) => handleDeliveryPriceChange(w, 'domicile', e.target.value)}
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            <input 
                                                                type="number" 
                                                                className="border rounded px-2 py-1 w-24" 
                                                                value={deliveryPrices[w]?.bureau || 0} 
                                                                onChange={(e) => handleDeliveryPriceChange(w, 'bureau', e.target.value)}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Policies Section */}
                        {activeSection === 'policies' && (
                            <section className="bg-white shadow rounded-lg overflow-hidden">
                                <div className="px-4 py-5 sm:p-6">
                                    <h2 className="text-xl font-semibold mb-4 text-indigo-700">📜 Store Policies</h2>
                                    <div className="space-y-4">
                                        <div className="max-w-xs">
                                            <label className="block text-sm font-medium text-gray-700">Return Window (Days)</label>
                                            <input type="number" name="returnDays" value={siteData.returnDays} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Warranty Policy</label>
                                            <textarea name="warranty" value={siteData.warranty} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 h-24" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Terms and Conditions</label>
                                            <textarea name="termsAndConditions" value={siteData.termsAndConditions} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 h-32" />
                                        </div>
                                        <div className="flex justify-end">
                                            <button onClick={() => handleSiteSubmit('policies')} disabled={loading} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-md font-medium transition shadow-md">
                                                Save Policies
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;
