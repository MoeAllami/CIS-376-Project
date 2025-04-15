'use client';

import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

interface SavedItem {
  _id: string;
  name: string;
  createdAt: string;
}

interface SaveLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'save' | 'load';
  type: 'sorting' | 'pathfinding';
  onSave?: (name: string) => void;
  onLoad?: (itemId: string) => void;
}

const SaveLoadModal: React.FC<SaveLoadModalProps> = ({
  isOpen,
  onClose,
  mode,
  type,
  onSave,
  onLoad
}) => {
  const [name, setName] = useState('');
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  // Fetch saved visualizations from the backend when loading
  useEffect(() => {
    if (mode === 'load' && isOpen) {
      fetch(`/api/load?type=${type}`)
        .then((res) => res.json())
        .then((data) => setSavedItems(data.visualizations))
        .catch((err) => console.error('Failed to load visualizations', err));
    }
  }, [mode, type, isOpen]);

  const handleSave = () => {
    if (onSave && name.trim()) {
      onSave(name.trim());
      setName('');
      onClose();
    }
  };

  const handleLoad = (itemId: string) => {
    if (onLoad) {
      onLoad(itemId);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" aria-hidden="true" />
        <div className="relative z-50 w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {mode === 'save' ? 'Save Visualization' : 'Load Visualization'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X />
              </button>
            </div>

            {mode === 'save' ? (
              <>
                <input
                  type="text"
                  placeholder="Enter a name"
                  className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 dark:text-white mb-4"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                  onClick={handleSave}
                >
                  Save
                </button>
              </>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {savedItems.length > 0 ? (
                  savedItems.map((item) => (
                    <div
                      key={item._id}
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-blue-100 dark:hover:bg-gray-600 cursor-pointer flex justify-between items-center"
                      onClick={() => handleLoad(item._id)}
                    >
                      <span className="text-sm font-medium dark:text-white">{item.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-300 text-sm">No saved visualizations found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default SaveLoadModal;