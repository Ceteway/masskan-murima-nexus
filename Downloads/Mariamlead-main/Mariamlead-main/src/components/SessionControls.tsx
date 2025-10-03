import { Pause, Play, RotateCcw } from 'lucide-react';

interface SessionControlsProps {
  status: 'idle' | 'generating' | 'paused' | 'completed' | 'error';
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  canPause: boolean;
  canResume: boolean;
}

export const SessionControls = ({
  status,
  onPause,
  onResume,
  onReset,
  canPause,
  canResume,
}: SessionControlsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Session Controls</h3>

      <div className="flex flex-col gap-3">
        <button
          onClick={onPause}
          disabled={!canPause || status !== 'generating'}
          className="flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Pause className="w-4 h-4" />
          Pause Generation
        </button>

        <button
          onClick={onResume}
          disabled={!canResume || status !== 'paused'}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          Resume Generation
        </button>

        <button
          onClick={onReset}
          disabled={status === 'generating'}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Session
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        {status === 'idle' && <p>Start a session to enable controls</p>}
        {status === 'generating' && <p>Generation in progress...</p>}
        {status === 'paused' && <p>Session paused - Resume to continue</p>}
        {status === 'completed' && <p>Session completed - Reset to start new</p>}
        {status === 'error' && <p>Error occurred - Reset to try again</p>}
      </div>
    </div>
  );
};
