const SubmissionModal=({ submission, close })=>{
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-3/4 max-h-[90vh] flex flex-col shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-bold text-xl">Source Code</h2>
                    <button onClick={close} className="text-gray-500 hover:text-black font-bold text-lg cursor-pointer">
                        ✕
                    </button>
                </div>
                
                <div className="flex-1 overflow-auto bg-[#1e1e1e] p-4 rounded-lg">
                    <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                        {submission.sourceCode}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default SubmissionModal;
