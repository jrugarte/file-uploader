"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Pencil, Trash, File, Upload } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { deleteFile, listFiles, renameFile, uploadFile } from "../actions";
import { ChangeEvent } from "react";
import { FileItem } from "../actions";
import { ErrorBoundary } from "react-error-boundary";

const API_URL =
  "vercel_blob_rw_qcIGhfzznvgV9elT_3BZcuiizFJEqhcNxqMiPAuP8qJv76P";

const FileUploadComponent: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [renameModalOpen, setRenameModalOpen] = useState<boolean>(false);
  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);
  const [currentFile, setCurrentFile] = useState<FileItem | null>(null);
  const [newFileName, setNewFileName] = useState<string>("");
  const [isRenaming, setIsRenaming] = useState<boolean>(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async (): Promise<void> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const fetchedFiles = await listFiles();
      setFiles(fetchedFiles);
    } catch (err: unknown) {
      toast.error(
        `Failed to fetch files: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("file") as File;

    if (!file || file.size === 0) {
      toast.error("Please select a file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setRejectModalOpen(true);
      return;
    }

    setIsUploading(true);
    const uploadToast = toast.loading("Uploading file...");

    try {
      await fetch(`${API_URL}/upload-begin`, { method: "POST" });
      const newFile = await uploadFile(formData);
      setFiles((prevFiles) => [...prevFiles, newFile]);
      await fetch(`${API_URL}/upload-success`, { method: "POST" });
      toast.success("File uploaded successfully", { id: uploadToast });
      form.reset();
    } catch (err: unknown) {
      await fetch(`${API_URL}/upload-fail`, { method: "POST" });
      toast.error(
        `Upload failed: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
        { id: uploadToast }
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (file: FileItem): Promise<void> => {
    const deleteToast = toast.loading("Deleting file...");
    try {
      await deleteFile(file.url);
      setFiles((prevFiles) =>
        prevFiles.filter((f) => f.pathname !== file.pathname)
      );
      toast.success("File deleted successfully", { id: deleteToast });
    } catch (err: unknown) {
      toast.error(
        `Delete failed: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
        { id: deleteToast }
      );
    }
  };

  const openRenameModal = (file: FileItem): void => {
    setCurrentFile(file);
    setNewFileName(file.name);
    setRenameModalOpen(true);
  };

  const handleRename = async (): Promise<void> => {
    if (!currentFile) return;

    setIsRenaming(true);
    const renameToast = toast.loading("Renaming file...");
    try {
      const renamedFile = await renameFile(currentFile.url, newFileName);
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.pathname === currentFile.pathname ? renamedFile : file
        )
      );
      setRenameModalOpen(false);
      toast.success("File renamed successfully", { id: renameToast });
    } catch (err: unknown) {
      toast.error(
        `Rename failed: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
        { id: renameToast }
      );
    } finally {
      setIsRenaming(false);
    }
  };

  const FileSkeleton = () => (
    <div className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
        <div className="flex space-x-2"></div>
        <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary
      fallback={
        <div className="text-center py-10">
          Something went wrong. Please try again later.
        </div>
      }
    >
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Toaster position="top-right" />

        <h1 className="text-2xl md:text-3xl font-semibold mb-6">
          File Uploader
        </h1>

        <form onSubmit={handleFileUpload} className="mb-8">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <Input
              type="file"
              name="file"
              id="file_input"
              disabled={isUploading}
              className="flex-grow w-full sm:w-auto"
            />
            <Button
              type="submit"
              disabled={isUploading}
              className="w-full sm:w-auto"
            >
              {isUploading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                <span className="flex items-center">
                  <Upload className="mr-2 h-4 w-4" /> Upload
                </span>
              )}
            </Button>
          </div>
        </form>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[...Array(4)].map((_, index) => (
              <FileSkeleton key={index} />
            ))}
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No files uploaded yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {files.map((file) => (
              <div
                key={file.pathname}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <File className="h-6 w-6 text-blue-500" />
                  <a
                    href={file.url}
                    download={file.name}
                    className="text-sm font-medium text-gray-900 truncate block"
                  >
                    {file.name}
                  </a>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openRenameModal(file)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(file)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={renameModalOpen} onOpenChange={setRenameModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Rename file</DialogTitle>
              <DialogDescription>
                Enter a new name for your file.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newFileName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setNewFileName(e.target.value)
                  }
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleRename}
                disabled={isRenaming}
              >
                {isRenaming ? "Renaming..." : "Save changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>File too large</DialogTitle>
              <DialogDescription>
                The selected file exceeds the 5MB limit. Please choose a smaller
                file.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setRejectModalOpen(false)}>OK</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundary>
  );
};

export default FileUploadComponent;
