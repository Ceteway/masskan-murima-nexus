import { Loader2, CheckCircle, XCircle, Pause } from 'lucide-react';

interface ProgressTrackerProps {
  currentCount: number;
  targetCount: number;
  currentBatch: number;
  totalBatches: number;
  status: 'idle' | 'generating' | 'paused' | 'completed' | 'error';
  errorMessage?: string;
}

export const ProgressTracker = ({
  currentCount,
  targetCount,
  currentBatch,
  totalBatches,
  status,
  errorMessage,
}: ProgressTrackerProps) => {
  const progress = (currentCount / targetCount) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">Progress</h3>
        {status === 'generating' && (
          <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
        )}
        {status === 'paused' && (
          <Pause className="w-5 h-5 text-yellow-600" />
        )}
        {status === 'completed' && (
          <CheckCircle className="w-5 h-5 text-green-600" />
        )}
        {status === 'error' && (
          <XCircle className="w-5 h-5 text-red-600" />
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Leads Generated</span>
          <span className="font-semibold">
            {currentCount} / {targetCount}
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-sm text-gray-600">
          <span>Batch Progress</span>
          <span className="font-semibold">
            {currentBatch} / {totalBatches}
          </span>
        </div>
      </div>

      {status === 'error' && errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      {status === 'paused' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800 font-medium">
            Generation paused - Resume to continue
          </p>
        </div>
      )}

      {status === 'completed' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800 font-medium">
            Lead generation completed successfully!
          </p>
        </div>
      )}
    </div>
  );
};
