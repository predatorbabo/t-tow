import React, { useState, useMemo } from 'react';
import { Truck, ShieldCheck } from 'lucide-react';
import { UserRole, User } from '../types';
import { TRANSLATIONS } from '../constants';
import { useTheme } from '../contexts/ThemeContext';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface AuthPageProps {
  onLogin: (user: User) => void;
  currentLang: 'en' | 'fr' | 'ar';
  setLanguage: (lang: 'en' | 'fr' | 'ar') => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, currentLang, setLanguage }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    vehicleModel: '',
    vehiclePlate: '',
    name: '',
  });

  const t = TRANSLATIONS[currentLang];
  const { primaryColor, textColor } = useTheme();

  const themeClasses = useMemo(() => ({
    background: textColor === 'gray' ? 'bg-gray-100' : 'bg-blue-100',
    text: textColor === 'gray' ? 'text-gray-800' : 'text-blue-800',
    textMuted: textColor === 'gray' ? 'text-gray-500' : 'text-blue-500',
    primary: primaryColor === 'blue' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white',
    primaryText: primaryColor === 'blue' ? 'text-blue-600' : 'text-gray-600',
    ring: primaryColor === 'blue' ? 'focus:ring-blue-500' : 'focus:ring-gray-500',
    border: textColor === 'gray' ? 'border-gray-300' : 'border-blue-300',
    activeTab: primaryColor === 'blue' ? 'bg-white shadow text-blue-600' : 'bg-white shadow text-gray-600',
    inactiveTab: textColor === 'gray' ? 'text-gray-500' : 'text-blue-500',
  }), [primaryColor, textColor]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (userDoc.exists()) {
          onLogin(userDoc.data() as User);
        } else {
          setError('User data not found.');
        }
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await sendEmailVerification(userCredential.user);

        const newUser: User = {
          id: userCredential.user.uid,
          email: formData.email,
          name: formData.name,
          role,
          language: currentLang,
          verified: userCredential.user.emailVerified,
          ...(role === UserRole.USER && { vehicle: { model: formData.vehicleModel, plate: formData.vehiclePlate } }),
          ...(role === UserRole.OWNER && { companyName: 'My Towing Co', isAvailable: true, truckType: 'flatbed', location: { lat: 0, lng: 0 }, lastUpdate: Date.now() }),
        };

        await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
        onLogin(newUser);
      }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError('This email address is already in use. Please login or use a different email.');
      } else {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${themeClasses.background} flex flex-col justify-center p-6 ${currentLang === 'ar' ? 'rtl' : ''}`}>
      <div className="text-center mb-8">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${themeClasses.primary.split(' ')[0]} text-white`}>
          <Truck size={32} />
        </div>
        <h1 className={`text-3xl font-bold ${themeClasses.text}`}>DzTow</h1>
        <p className={`${themeClasses.textMuted} mt-2`}>{t.welcome}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className={`flex justify-center mb-6 ${themeClasses.background} p-1 rounded-lg`}>
          <button
            onClick={() => setRole(UserRole.USER)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${role === UserRole.USER ? themeClasses.activeTab : themeClasses.inactiveTab}`}>
            {t.driver}
          </button>
          <button
            onClick={() => setRole(UserRole.OWNER)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${role === UserRole.OWNER ? themeClasses.activeTab : themeClasses.inactiveTab}`}>
            {t.owner}
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>Name</label>
              <input
                type="text"
                name="name"
                className={`w-full p-3 border ${themeClasses.border} rounded-lg focus:ring-2 ${themeClasses.ring} outline-none`}
                placeholder="Your Name"
                required
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
          )}
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>Email</label>
            <input
              type="email"
              name="email"
              className={`w-full p-3 border ${themeClasses.border} rounded-lg focus:ring-2 ${themeClasses.ring} outline-none`}
              placeholder="email@example.com"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>Password</label>
            <input
              type="password"
              name="password"
              className={`w-full p-3 border ${themeClasses.border} rounded-lg focus:ring-2 ${themeClasses.ring} outline-none`}
              placeholder="••••••"
              required
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          {!isLogin && role === UserRole.USER && (
            <>
              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>Vehicle Model</label>
                <input
                  type="text"
                  name="vehicleModel"
                  className={`w-full p-3 border ${themeClasses.border} rounded-lg focus:ring-2 ${themeClasses.ring} outline-none`}
                  placeholder="e.g. Renault Clio 4"
                  value={formData.vehicleModel}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>License Plate</label>
                <input
                  type="text"
                  name="vehiclePlate"
                  className={`w-full p-3 border ${themeClasses.border} rounded-lg focus:ring-2 ${themeClasses.ring} outline-none`}
                  placeholder="00123 115 16"
                  value={formData.vehiclePlate}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button type="submit" className={`w-full py-3 rounded-lg font-semibold transition-colors ${themeClasses.primary}`} disabled={isLoading}>
            {isLoading ? 'Loading...' : (isLogin ? t.login : t.signup)}
          </button>
        </form>

        <button onClick={() => setIsLogin(!isLogin)} className={`w-full mt-4 text-sm ${themeClasses.primaryText} text-center`}>
          {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
        </button>
      </div>

      <div className="mt-8 text-center">
        <select
          value={currentLang}
          onChange={(e) => setLanguage(e.target.value as 'en' | 'fr' | 'ar')}
          className={`bg-transparent ${themeClasses.textMuted} text-sm`}>
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="ar">العربية</option>
        </select>
      </div>
    </div>
  );
};

export default AuthPage;
