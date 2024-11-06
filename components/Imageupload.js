"use client"
import { useState } from 'react';
import { IKUpload, ImageKitProvider } from "imagekitio-next";
import { toast } from "react-toastify";

const ImageUpload = ({ onImageUpload }) => {
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [progress, setProgress] = useState(0);

  const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;


  const authenticator = async () => {
    try {
        const res = await fetch("/api/auth");
        if (!res.ok) {
            throw new Error("Error authenticating!");
        }
        const data = await res.json();
        const { signature, expire, token } = data;
        return { signature, expire, token };
    } catch (err) {
        // console.log(err.message);
        setError("Authentication failed");
    }
};



  const onError = (err) => {
    // console.log("error:", err);
    toast.error("Image upload failed");
    setUploadStatus('error');
  };

  const onSuccess = (res) => {
    // console.log("Success", res);
    setUploadStatus('success');
    setProgress(100);
    onImageUpload(res.url);
    toast.success("Image uploaded successfully!");
  };

  const onUploadStart = (evt) => {
    // console.log("Start", evt);
    setUploadStatus('uploading');
    setProgress(0);
  };

  const onUploadProgress = (evt) => {
    setProgress(evt.loaded / evt.total * 100);
  };

  return (
    <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={authenticator}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Upload Image
        </label>
        <IKUpload
          onError={onError}
          onSuccess={onSuccess}
          onUploadStart={onUploadStart}
          onUploadProgress={onUploadProgress}
        />
        {uploadStatus === 'uploading' && (
          <div className="mt-2">
            <div className="bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Uploading... {progress.toFixed(0)}%</p>
          </div>
        )}
        {uploadStatus === 'success' && <p className="text-sm text-green-500 mt-1">Upload successful</p>}
        {uploadStatus === 'error' && <p className="text-sm text-red-500 mt-1">Upload failed</p>}
      </div>
    </ImageKitProvider>
  );
};

export default ImageUpload;