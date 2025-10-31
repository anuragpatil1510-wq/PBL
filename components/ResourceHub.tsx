import React from 'react';
import type { Resource } from '../types';

interface ResourceHubProps {
  resources: Resource[];
}

const ResourceHub: React.FC<ResourceHubProps> = ({ resources }) => {
  const getIconForType = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('tool')) return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
    if (lowerType.includes('video')) return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
    if (lowerType.includes('app')) return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Resource Hub</h3>
      <div className="space-y-3">
        {resources.map((resource, index) => (
          <a
            key={index}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-white/20 dark:bg-slate-900/30 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 rounded-lg hover:bg-white/40 dark:hover:bg-slate-900/50 transition-colors group"
          >
            <div className="flex items-center space-x-3">
                <div className="text-teal-500 bg-teal-500/10 p-2 rounded-md">
                    {getIconForType(resource.type)}
                </div>
                <div>
                    <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-400">{resource.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{resource.type}</p>
                </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ResourceHub;