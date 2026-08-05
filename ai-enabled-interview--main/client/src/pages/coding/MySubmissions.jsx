import { useEffect, useState } from "react";
import { getMySubmissions } from "../../services/SubmissionService";
import SubmissionModal from "../../components/coding/SubmissionModal";

const MySubmissions = () => {
    const [submissions, setSubmissions] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            const data = await getMySubmissions();
            setSubmissions(data.submissions || []);
        } catch(error) {
            console.error("Error loading submissions:", error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-5">
                My Submissions
            </h1>

            <div className="space-y-4">
                {submissions.map((sub) => (
                    <div
                        key={sub._id}
                        className="border rounded-lg p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                        onClick={() => setSelected(sub)}
                    >
                        <div className="flex justify-between">
                            <h2 className="font-bold">
                                {sub.problem?.title}
                            </h2>
                            <span
                                className={
                                    sub.status === "Accepted"
                                        ? "text-green-600"
                                        : "text-red-600"
                                }
                            >
                                {sub.status}
                            </span>
                        </div>

                        <div className="mt-3 flex gap-6 text-sm text-gray-600">
                            <p>
                                <strong>Language:</strong> {sub.language}
                            </p>
                            <p>
                                <strong>Tests:</strong> {sub.testCasesPassed ?? 0} / {sub.totalTestCases ?? 0}
                            </p>
                            <p>
                                <strong>Runtime:</strong> {sub.executionTime ?? 0} ms
                            </p>
                            <p>
                                <strong>Memory:</strong> {sub.memoryUsed ?? 0} KB
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {selected && (
                <SubmissionModal
                    submission={selected}
                    close={() => setSelected(null)}
                />
            )}
        </div>
    );
};

export default MySubmissions;
