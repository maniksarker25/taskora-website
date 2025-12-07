// components/my_tasks/cancellation/components/FilePreview.jsx
const FilePreview = ({ url, name, onDownload, onPreview }) => {
    const getFileIcon = () => {
        if (!url) return "📎";
        if (url.includes(".pdf")) return "📄";
        if (["jpg", "jpeg", "png", "gif", "webp"].some(ext => url.includes(ext))) return "🖼️";
        return "📎";
    };

    return (
        <div className="flex items-center gap-2 p-2 rounded">
            <span className="text-gray-500">{getFileIcon()}</span>
            <span className="text-sm text-gray-600">{name}</span>
            {onPreview && (
                <button
                    onClick={onPreview}
                    className="text-xs text-blue-600 hover:text-blue-800"
                >
                    Preview
                </button>
            )}
            {onDownload && (
                <button
                    onClick={onDownload}
                    className="text-xs text-[#115E59] hover:text-teal-700"
                >
                    Download
                </button>
            )}
        </div>
    );
};

export default FilePreview;