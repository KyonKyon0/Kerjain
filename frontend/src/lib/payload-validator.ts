const ALLOWED_IMAGE_PREFIXES = [
  'data:image/jpeg;base64,',
  'data:image/jpg;base64,',
  'data:image/png;base64,',
  'data:image/webp;base64,',
  'data:image/avif;base64,'
];

const MAX_BASE64_BYTE_SIZE = 3 * 1024 * 1024; // 3MB

/**
 * Server-side guardrail against corrupt, malicious, or OOM-inducing oversized base64 images
 */
export function validateBase64Image(dataUrl: string | null | undefined): { valid: boolean; error?: string } {
  if (!dataUrl || typeof dataUrl !== 'string') {
    return { valid: true };
  }

  if (!dataUrl.startsWith('data:image/')) {
    if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://')) {
      return { valid: true };
    }
    return { valid: false, error: 'Format gambar tidak valid. Harus berupa URL gambar atau data:image.' };
  }

  const hasValidPrefix = ALLOWED_IMAGE_PREFIXES.some(prefix => dataUrl.startsWith(prefix));
  if (!hasValidPrefix) {
    return { valid: false, error: 'Tipe gambar tidak didukung. Gunakan JPEG, PNG, atau WebP.' };
  }

  const commaIndex = dataUrl.indexOf(',');
  const base64Data = dataUrl.substring(commaIndex + 1);
  const approximateBytes = Math.round((base64Data.length * 3) / 4);

  if (approximateBytes > MAX_BASE64_BYTE_SIZE) {
    return { valid: false, error: 'Ukuran gambar melebihi batas maksimal 3MB.' };
  }

  return { valid: true };
}
