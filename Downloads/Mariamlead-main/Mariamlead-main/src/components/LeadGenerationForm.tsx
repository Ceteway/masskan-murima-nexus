import { useState } from 'react';
import { MapPin, Building2 } from 'lucide-react';

interface LeadGenerationFormProps {
  onSubmit: (location: string, industry: string, dailyTarget: number, batchSize: number) => void;
  isGenerating: boolean;
}

export const LeadGenerationForm = ({ onSubmit, isGenerating }: LeadGenerationFormProps) => {
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [dailyTarget, setDailyTarget] = useState(300);
  const [batchSize, setBatchSize] = useState(50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location && industry) {
      onSubmit(location, industry, dailyTarget, batchSize);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Generate Business Leads</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline w-4 h-4 mr-1" />
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., Springfield VA, Fairfax VA, NYC"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isGenerating}
          />
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
            <Building2 className="inline w-4 h-4 mr-1" />
            Industry / Sector
          </label>
          <input
            type="text"
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="e.g., Property Management, Cleaning, Health & Wellness"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            disabled={isGenerating}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="dailyTarget" className="block text-sm font-medium text-gray-700 mb-2">
              Daily Target
            </label>
            <input
              type="number"
              id="dailyTarget"
              value={dailyTarget}
              onChange={(e) => setDailyTarget(Number(e.target.value))}
              min="50"
              max="300"
              step="50"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isGenerating}
            />
          </div>

          <div>
            <label htmlFor="batchSize" className="block text-sm font-medium text-gray-700 mb-2">
              Batch Size
            </label>
            <input
              type="number"
              id="batchSize"
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              min="25"
              max="100"
              step="25"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isGenerating}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isGenerating || !location || !industry}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isGenerating ? 'Generating...' : 'Start Generating Leads'}
      </button>
    </form>
  );
};
