/**
 * Reads a File and resolves with its base64-encoded data (without the data-URL prefix).
 */
export function readAsBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = (reader.result as string).split(",")[1];
      if (base64Data) resolve(base64Data);
      else reject(new Error("Failed to read file as base64"));
    };
    reader.onerror = () => reject(new Error(String(reader.error)));
    reader.readAsDataURL(file);
  });
}
