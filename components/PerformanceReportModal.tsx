import React, { useRef } from 'react';

interface PerformanceReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    report: string;
    studentName: string;
}

const PerformanceReportModal: React.FC<PerformanceReportModalProps> = ({ isOpen, onClose, report, studentName }) => {
    const reportRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=800,width=800');
        if (printWindow && reportRef.current) {
            printWindow.document.write('<html><head><title>Performance Report</title>');
            printWindow.document.write('<style>body { font-family: sans-serif; line-height: 1.6; } h1, h2 { color: #333; } h1 {font-size: 24px;} h2 {font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 5px;} div { margin-bottom: 15px; }</style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write(reportRef.current.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">AI Performance Report</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">&times;</button>
                </header>
                <div className="p-6 overflow-y-auto">
                    <div ref={reportRef}>
                        <h1 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '1rem'}}>Performance Report for {studentName}</h1>
                        <h2 style={{fontSize: '16px', color: '#555', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem'}}>Generated on: {new Date().toLocaleDateString()}</h2>
                        <div className="prose prose-slate dark:prose-invert" dangerouslySetInnerHTML={{ __html: report }} />
                    </div>
                </div>
                <footer className="p-4 border-t dark:border-slate-700 mt-auto flex justify-end">
                    <button onClick={handlePrint} className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-teal-700 transition-colors flex items-center space-x-2">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v-4a1 1 0 011-1h10a1 1 0 011 1v4h1a2 2 0 002-2v-3a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>
                        <span>Print / Download PDF</span>
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default PerformanceReportModal;