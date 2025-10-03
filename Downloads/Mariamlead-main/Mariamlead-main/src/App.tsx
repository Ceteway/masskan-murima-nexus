import { useState, useCallback, useRef } from 'react';
import { Database } from 'lucide-react';
import { LeadGenerationForm } from './components/LeadGenerationForm';
import { ProgressTracker } from './components/ProgressTracker';
import { LeadsTable } from './components/LeadsTable';
import { SessionControls } from './components/SessionControls';
import {
  createSession,
  generateLeadsBatch,
  updateSessionProgress,
  getSessionLeads,
  removeDuplicateLeads,
  exportToCSV,
  recordBatchDownload,
} from './lib/leadGeneration';
import type { Lead } from './lib/supabase';

type GenerationStatus = 'idle' | 'generating' | 'paused' | 'completed' | 'error';

function App() {
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [currentCount, setCurrentCount] = useState(0);
  const [targetCount, setTargetCount] = useState(300);
  const [currentBatch, setCurrentBatch] = useState(0);
  const [totalBatches, setTotalBatches] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [batchSize, setBatchSize] = useState(50);

  const isPausedRef = useRef(false);
  const sessionDataRef = useRef<{
    allLeads: Lead[];
    batchNum: number;
    loc: string;
    ind: string;
    dailyTarget: number;
    batchSize: number;
    sessionId: string;
  } | null>(null);

  const generateLeadsLoop = async (
    allLeads: Lead[],
    batchNum: number,
    loc: string,
    ind: string,
    dailyTarget: number,
    bSize: number,
    sesId: string
  ) => {
    let currentLeadCount = allLeads.length;
    let currentBatchNum = batchNum;

    while (currentLeadCount < dailyTarget && !isPausedRef.current) {
      const remainingLeads = dailyTarget - currentLeadCount;
      const currentBatchSize = Math.min(bSize, remainingLeads);

      setCurrentBatch(currentBatchNum);

      const newBatchLeads = await generateLeadsBatch({
        location: loc,
        industry: ind,
        batchSize: currentBatchSize,
        sessionId: sesId,
        currentBatch: currentBatchNum,
        existingLeads: allLeads,
      });

      allLeads.push(...newBatchLeads);
      currentLeadCount = allLeads.length;

      const uniqueLeads = removeDuplicateLeads(allLeads);
      setLeads(uniqueLeads);
      setCurrentCount(uniqueLeads.length);

      await updateSessionProgress(sesId, uniqueLeads.length, 'active');

      currentBatchNum++;

      if (currentLeadCount >= dailyTarget) {
        break;
      }
    }

    sessionDataRef.current = {
      allLeads,
      batchNum: currentBatchNum,
      loc,
      ind,
      dailyTarget,
      batchSize: bSize,
      sessionId: sesId,
    };

    if (isPausedRef.current) {
      setStatus('paused');
      await updateSessionProgress(sesId, currentLeadCount, 'paused');
    } else {
      await updateSessionProgress(sesId, currentLeadCount, 'completed');
      setStatus('completed');
    }
  };

  const handleStartGeneration = async (
    loc: string,
    ind: string,
    dailyTarget: number,
    bSize: number
  ) => {
    try {
      setStatus('generating');
      setErrorMessage('');
      setLocation(loc);
      setIndustry(ind);
      setTargetCount(dailyTarget);
      setBatchSize(bSize);
      setTotalBatches(Math.ceil(dailyTarget / bSize));
      isPausedRef.current = false;

      const session = await createSession(loc, ind, dailyTarget, bSize);
      setSessionId(session.id);

      const allLeads: Lead[] = [];
      const batchNum = 1;

      await generateLeadsLoop(allLeads, batchNum, loc, ind, dailyTarget, bSize, session.id);
    } catch (error) {
      console.error('Error generating leads:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to generate leads');
    }
  };

  const handlePause = () => {
    if (status === 'generating') {
      isPausedRef.current = true;
    }
  };

  const handleResume = async () => {
    if (status === 'paused' && sessionDataRef.current) {
      try {
        setStatus('generating');
        setErrorMessage('');
        isPausedRef.current = false;

        const { allLeads, batchNum, loc, ind, dailyTarget, batchSize: bSize, sessionId: sesId } = sessionDataRef.current;

        await generateLeadsLoop(allLeads, batchNum, loc, ind, dailyTarget, bSize, sesId);
      } catch (error) {
        console.error('Error resuming generation:', error);
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'Failed to resume generation');
      }
    }
  };

  const handleReset = () => {
    isPausedRef.current = false;
    sessionDataRef.current = null;
    setStatus('idle');
    setSessionId(null);
    setLeads([]);
    setCurrentCount(0);
    setTargetCount(300);
    setCurrentBatch(0);
    setTotalBatches(0);
    setErrorMessage('');
    setLocation('');
    setIndustry('');
    setBatchSize(50);
  };

  const handleDownloadBatch = useCallback(
    async (batchNumber: number) => {
      const batchLeads = leads.filter((lead) => lead.batch_number === batchNumber);
      const filename = `${location} - ${industry} - Batch ${batchNumber}.csv`;
      exportToCSV(batchLeads, filename);

      if (sessionId) {
        await recordBatchDownload(sessionId, batchNumber, batchLeads.length);
      }
    },
    [leads, location, industry, sessionId]
  );

  const handleDownloadAll = useCallback(async () => {
    const filename = `${location} - ${industry} - All Leads.csv`;
    exportToCSV(leads, filename);

    if (sessionId) {
      const batches = Array.from(new Set(leads.map((lead) => lead.batch_number)));
      for (const batchNumber of batches) {
        const batchLeads = leads.filter((lead) => lead.batch_number === batchNumber);
        await recordBatchDownload(sessionId, batchNumber, batchLeads.length);
      }
    }
  }, [leads, location, industry, sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Database className="w-10 h-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Mariam</h1>
          </div>
          <p className="text-gray-600 text-lg">Business Lead Generation Platform</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <LeadGenerationForm
              onSubmit={handleStartGeneration}
              isGenerating={status === 'generating' || status === 'paused'}
            />
          </div>

          <div className="space-y-6">
            <ProgressTracker
              currentCount={currentCount}
              targetCount={targetCount}
              currentBatch={currentBatch}
              totalBatches={totalBatches}
              status={status}
              errorMessage={errorMessage}
            />

            {status !== 'idle' && (
              <SessionControls
                status={status}
                onPause={handlePause}
                onResume={handleResume}
                onReset={handleReset}
                canPause={status === 'generating'}
                canResume={status === 'paused'}
              />
            )}
          </div>
        </div>

        {leads.length > 0 && (
          <div className="mb-8">
            <LeadsTable
              leads={leads}
              onDownloadBatch={handleDownloadBatch}
              onDownloadAll={handleDownloadAll}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
