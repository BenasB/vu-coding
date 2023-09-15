export const readFileAsArrayBuffer: (
  file: File,
) => Promise<ArrayBuffer> = file => {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      if (fr.result && fr.result instanceof ArrayBuffer) resolve(fr.result);
      else reject();
    };
    fr.onerror = reject;
    fr.readAsArrayBuffer(file);
  });
};
