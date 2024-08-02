"use server";

import { put, del, list } from "@vercel/blob";

export interface FileItem {
  name: string;
  url: string;
  pathname: string;
}

export async function uploadFile(formData: FormData): Promise<FileItem> {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file provided");
    }

    if (file.size === 0) {
      throw new Error("File is empty");
    }

    const blob = await put(file.name, file, {
      access: "public",
    });

    return {
      name: blob.pathname.split("/").pop() || "",
      url: blob.url,
      pathname: blob.pathname,
    };
  } catch (error: unknown) {
    console.error("Error in uploadFile:", error);
    throw new Error(
      `Upload failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function deleteFile(pathname: string): Promise<void> {
  try {
    await del(pathname);
  } catch (error: unknown) {
    console.error("Error in deleteFile:", error);
    throw new Error(
      `Delete failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function renameFile(
  oldPathname: string,
  newName: string
): Promise<FileItem> {
  try {
    const response = await fetch(oldPathname);
    if (!response.ok) throw new Error("Failed to fetch old file");
    const oldBlob = await response.blob();

    const newBlob = await put(newName, oldBlob, {
      access: "public",
    });

    await del(oldPathname);

    return {
      name: newName,
      url: newBlob.url,
      pathname: newBlob.pathname,
    };
  } catch (error: unknown) {
    console.error("Error in renameFile:", error);
    throw new Error(
      `Rename failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function listFiles(): Promise<FileItem[]> {
  try {
    const { blobs } = await list();
    return blobs.map((blob) => ({
      name: blob.pathname.split("/").pop() || "",
      url: blob.url,
      pathname: blob.pathname,
    }));
  } catch (error: unknown) {
    console.error("Error in listFiles:", error);
    throw new Error(
      `List files failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
