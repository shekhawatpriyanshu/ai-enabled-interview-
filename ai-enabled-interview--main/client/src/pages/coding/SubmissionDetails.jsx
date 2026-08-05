import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSubmissionDetails } from "../../services/SubmissionService";

const SubmissionDetails = () => {
    const { id } = useParams();
    const [submission, setSubmission] = useState(null);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            const data = await getSubmissionDetails(id);
            setSubmission(data.submission);
        } catch(error) {
            console.error("Error loading submission:", error);
        }
    };

    if(!submission) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold">
                Submission Details
            </h1>
            <p>
                Status: {submission.status}
            </p>
            <p>
                Language: {submission.language}
            </p>
            <h2 className="mt-5 font-bold">
                Source Code
            </h2>
            <pre className="bg-black text-white p-4 rounded">
                {submission.sourceCode}
            </pre>
        </div>
    );
};

export default SubmissionDetails;
