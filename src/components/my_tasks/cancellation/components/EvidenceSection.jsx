import FilePreview from "./FilePreview";


export const EvidenceSection = ({ 
    cancellationEvidence, 
    rejectEvidence, 
    onDownload 
}) => {
    if (!cancellationEvidence?.length && !rejectEvidence) {
        return null;
    }

    return (
        <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Supporting Evidence</h4>
            <div className="rounded-lg">
                {cancellationEvidence?.map((evidence, index) => (
                    <FilePreview
                        key={index}
                        url={evidence}
                        name={`Evidence ${index + 1}`}
                        onDownload={() => onDownload(evidence, `evidence-${index + 1}`)}
                    />
                ))}
                {/* {rejectEvidence && (
                    <FilePreview
                        url={rejectEvidence}
                        name="Rejection Evidence"
                        onDownload={() => onDownload(rejectEvidence, "reject-evidence")}
                    />
                )} */}
            </div>
        </div>
    );
};

export default EvidenceSection;