import type { Lead } from './supabase';

// Local storage keys
const SESSIONS_KEY = 'lead_generation_sessions';
const LEADS_KEY = 'lead_generation_leads';

export interface GenerateLeadsParams {
  location: string;
  industry: string;
  batchSize: number;
  sessionId: string;
  currentBatch: number;
  existingLeads: Lead[];
}

export const generateLeadsBatch = async ({
  location,
  industry,
  batchSize,
  sessionId,
  currentBatch,
  existingLeads,
}: GenerateLeadsParams): Promise<Lead[]> => {
  // Call Netlify function for AI-generated leads
  const functionUrl = '/.netlify/functions/generate-leads';

  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      location,
      industry,
      batchSize,
      existingLeads: existingLeads.map(lead => ({
        business_name: lead.business_name,
        phone_contact: lead.phone_contact,
      })),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate leads');
  }

  const data = await response.json();
  const newLeads = data.leads;

  const leadsToInsert = newLeads.map((lead: { business_name: string; phone_contact: string }, index: number) => ({
    id: `${sessionId}-${currentBatch}-${index}`,
    session_id: sessionId,
    business_name: lead.business_name,
    phone_contact: lead.phone_contact,
    location,
    industry,
    batch_number: currentBatch,
    is_downloaded: false,
    created_at: new Date().toISOString(),
  }));

  // Save to localStorage
  const existingLeadsData = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
  const updatedLeads = [...existingLeadsData, ...leadsToInsert];
  localStorage.setItem(LEADS_KEY, JSON.stringify(updatedLeads));

  return leadsToInsert;
};

export const createSession = async (
  location: string,
  industry: string,
  dailyTarget: number,
  batchSize: number
) => {
  const session = {
    id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    location,
    industry,
    daily_target: dailyTarget,
    batch_size: batchSize,
    current_count: 0,
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Save to localStorage
  const existingSessions = JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
  existingSessions.push(session);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(existingSessions));

  return session;
};

export const updateSessionProgress = async (sessionId: string, currentCount: number, status: string) => {
  const sessions = JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
  const sessionIndex = sessions.findIndex((s: any) => s.id === sessionId);

  if (sessionIndex !== -1) {
    sessions[sessionIndex].current_count = currentCount;
    sessions[sessionIndex].status = status;
    sessions[sessionIndex].updated_at = new Date().toISOString();
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }
};

export const getSessionLeads = async (sessionId: string) => {
  const leads = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
  return leads
    .filter((lead: Lead) => lead.session_id === sessionId)
    .sort((a: Lead, b: Lead) => {
      if (a.batch_number !== b.batch_number) {
        return a.batch_number - b.batch_number;
      }
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
};

export const removeDuplicateLeads = (leads: Lead[]): Lead[] => {
  const seen = new Set<string>();
  return leads.filter((lead) => {
    const key = `${lead.business_name.toLowerCase()}|${lead.phone_contact.replace(/\D/g, '')}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

export const validatePhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
};

export const exportToCSV = (leads: Lead[], filename: string): void => {
  const headers = ['Business Name', 'Phone Contact'];
  const rows = leads.map(lead => [
    lead.business_name,
    `="${lead.phone_contact}"`,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => `"${row[0]}",${row[1]}`),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const recordBatchDownload = async (sessionId: string, batchNumber: number, _leadCount: number) => {
  // For localStorage, we can just mark leads as downloaded
  const leads = JSON.parse(localStorage.getItem(LEADS_KEY) || '[]');
  const updatedLeads = leads.map((lead: Lead) => {
    if (lead.session_id === sessionId && lead.batch_number === batchNumber) {
      return { ...lead, is_downloaded: true };
    }
    return lead;
  });
  localStorage.setItem(LEADS_KEY, JSON.stringify(updatedLeads));
};
