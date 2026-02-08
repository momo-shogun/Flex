import JSZip from 'jszip';

export async function deployToVercel(
  _files: Map<string, string>
): Promise<{ url?: string; error: string }> {
  const token = import.meta.env.VITE_VERCEL_TOKEN;
  if (!token) {
    return {
      error:
        'Deploy to Vercel requires VITE_VERCEL_TOKEN in .env. Export your project as ZIP and deploy manually at vercel.com.',
    };
  }
  return {
    error:
      'Vercel API deployment not implemented. Export as ZIP and drag the folder to vercel.com/dashboard.',
  };
}

export async function deployToNetlify(
  _files: Map<string, string>
): Promise<{ url?: string; error: string }> {
  const token = import.meta.env.VITE_NETLIFY_TOKEN;
  if (!token) {
    return {
      error:
        'Deploy to Netlify requires VITE_NETLIFY_TOKEN in .env. Export as ZIP and deploy at app.netlify.com.',
    };
  }
  return {
    error:
      'Netlify API deployment not implemented. Export as ZIP and use Netlify Drop or connect your repo.',
  };
}

export async function downloadAsZip(
  files: Map<string, string>,
  filename = 'flex-website.zip'
): Promise<void> {
  const zip = new JSZip();
  for (const [path, content] of files.entries()) {
    zip.file(path, content);
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
