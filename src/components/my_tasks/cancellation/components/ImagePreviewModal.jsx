import { X, Download } from "lucide-react";
import Image from "next/image";
import { ActionButton } from "./ActionButton";

export const ImagePreviewModal = ({ 
    showImagePreview, 
    setShowImagePreview, 
    selectedImage, 
    taskId, 
    handleFileDownload 
}) => {
    if (!showImagePreview) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 p-4">
            <div className="relative max-w-4xl max-h-full">
                <button
                    onClick={() => setShowImagePreview(false)}
                    className="absolute -top-10 right-0 text-white hover:text-gray-300 cursor-pointer z-10"
                >
                    <X className="w-6 h-6" />
                </button>
                <div className="bg-white rounded-lg overflow-hidden">
                    <Image
                        src={selectedImage}
                        alt="Evidence preview"
                        width={800}
                        height={600}
                        className="max-w-full max-h-[80vh] object-contain"
                    />
                </div>
                <div className="flex justify-center mt-4">
                    <ActionButton
                        onClick={() => handleFileDownload(selectedImage, `evidence-image-${taskId}`)}
                        variant="primary"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download Image
                    </ActionButton>
                </div>
            </div>
        </div>
    );
};

export default ImagePreviewModal;