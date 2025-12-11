export const TruckTypeBadge = ({ type }: { type: 'flatbed' | 'hook_and_chain' | 'wheel_lift' }) => {
  const colors = {
    flatbed: 'bg-blue-100 text-blue-800',
    wheel_lift: 'bg-green-100 text-green-800',
    hook_and_chain: 'bg-orange-100 text-orange-800',
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${colors[type] || 'bg-gray-100 text-gray-800'}`}>
      {type.replace('_', ' ')}
    </span>
  );
};
