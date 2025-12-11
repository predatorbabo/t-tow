import { useTheme } from '../contexts/ThemeContext';

export const Header = ({ title, currentLang, setLanguage }: any) => {
  const { primaryColor } = useTheme();
  return (
    <div className={`bg-${primaryColor}-600 text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-50`}>
      <h1 className="text-xl font-bold font-heading">{title}</h1>
      <select 
        value={currentLang} 
        onChange={(e) => setLanguage(e.target.value)}
        className={`bg-${primaryColor}-700 text-white text-xs p-1 rounded border-none outline-none`}
      >
        <option value="en">EN</option>
        <option value="fr">FR</option>
        <option value="ar">AR</option>
      </select>
    </div>
  );
};