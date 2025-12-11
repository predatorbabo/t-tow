import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, Phone, HelpCircle, ChevronUp, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { TRANSLATIONS } from '../constants';

const SupportPage = ({ currentLang }: any) => {
  const navigate = useNavigate();
  const isRtl = currentLang === 'ar';
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { primaryColor, textColor } = useTheme();
  const t = TRANSLATIONS[currentLang as keyof typeof TRANSLATIONS];

  const faqs = [
    { q: "How do I request a tow truck?", a: "Go to the Home screen, confirm your location on the map, and tap the big red 'Request Tow Truck' button. Nearby drivers will be notified." },
    { q: "How is the price calculated?", a: "For this MVP version, prices are negotiated directly with the truck owner. We will add in-app estimates soon." },
    { q: "Can I cancel my request?", a: "Yes, you can cancel your request at any time from the home screen before the driver arrives." },
    { q: "Is this service available 24/7?", a: "It depends on the availability of independent truck owners in your area." }
  ];

  return (
    <div className={`p-4 pb-20 ${isRtl ? 'rtl' : ''}`}>
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-full hover:bg-gray-100 mr-2"
        >
          <ChevronLeft size={24} className={`text-${textColor}-700 ${isRtl ? 'rotate-180' : ''}`} />
        </button>
        <h1 className={`text-xl font-bold text-${textColor}-800`}>{t.helpSupport}</h1>
      </div>

      <div className="space-y-6">
        {/* Contact Actions */}
        <div className="grid grid-cols-2 gap-4">
          <a href="mailto:support@dztow.dz" className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center space-y-2 hover:bg-gray-50">
            <div className={`bg-${primaryColor}-100 p-3 rounded-full text-${primaryColor}-600`}>
              <Mail size={24} />
            </div>
            <span className={`font-medium text-sm text-${textColor}-700`}>{t.emailUs}</span>
          </a>
          <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col items-center justify-center space-y-2 hover:bg-gray-50 opacity-50 cursor-not-allowed">
            <div className="bg-green-100 p-3 rounded-full text-green-600">
              <Phone size={24} />
            </div>
            <span className={`font-medium text-sm text-${textColor}-700`}>{t.callSupport}</span>
          </div>
        </div>

        {/* FAQs */}
        <div>
          <h2 className={`font-bold text-lg text-${textColor}-800 mb-3 flex items-center`}>
            <HelpCircle size={18} className={`mr-2 text-${textColor}-500`} /> {t.faq}
          </h2>
          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className={`w-full flex justify-between items-center p-4 text-left font-medium text-sm text-${textColor}-700 hover:bg-gray-50`}
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openFaq === idx && (
                  <div className={`p-4 pt-0 text-xs text-${textColor}-500 bg-gray-50 leading-relaxed border-t border-gray-100`}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Report Issue */}
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <h2 className={`font-bold text-${textColor}-800 mb-2 text-sm`}>{t.reportIssue}</h2>
          <p className={`text-xs text-${textColor}-500 mb-3`}>Found a bug or having trouble? Let us know.</p>
          <textarea 
            className={`w-full bg-${textColor}-50 border border-${textColor}-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-${primaryColor}-500 outline-none`}
            rows={3}
            placeholder={t.describeIssue}
          ></textarea>
          <button className={`mt-3 w-full bg-${textColor}-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-${textColor}-900`}>
            {t.submitReport}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
