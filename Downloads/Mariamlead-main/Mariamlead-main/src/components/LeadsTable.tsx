import { Download } from 'lucide-react';
import type { Lead } from '../lib/supabase';

interface LeadsTableProps {
  leads: Lead[];
  onDownloadBatch: (batchNumber: number) => void;
  onDownloadAll: () => void;
}

export const LeadsTable = ({ leads, onDownloadBatch, onDownloadAll }: LeadsTableProps) => {
  const batches = Array.from(new Set(leads.map(lead => lead.batch_number))).sort((a, b) => a - b);

  const getLeadsForBatch = (batchNumber: number) => {
    return leads.filter(lead => lead.batch_number === batchNumber);
  };

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-center text-gray-500">No leads generated yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Generated Leads</h3>
        <button
          onClick={onDownloadAll}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Download All ({leads.length} leads)
        </button>
      </div>

      <div className="divide-y divide-gray-200">
        {batches.map(batchNumber => {
          const batchLeads = getLeadsForBatch(batchNumber);
          return (
            <div key={batchNumber} className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-700">
                  Batch {batchNumber} ({batchLeads.length} leads)
                </h4>
                <button
                  onClick={() => onDownloadBatch(batchNumber)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 px-3 rounded-lg transition-colors text-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Batch
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Business Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone Contact
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Industry
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {batchLeads.slice(0, 10).map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{lead.business_name}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{lead.phone_contact}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{lead.location}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{lead.industry}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {batchLeads.length > 10 && (
                  <p className="text-sm text-gray-500 text-center py-3">
                    Showing 10 of {batchLeads.length} leads. Download to view all.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
