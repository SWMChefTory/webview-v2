/**
 * Clipboard utility with fallback for older browsers
 */

export async function copyToClipboard(text: string): Promise<{ success: boolean }> {
  // Try modern Clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } catch {
      // Fall back to legacy method
      return fallbackCopyToClipboard(text);
    }
  }

  // Use fallback if Clipboard API not available
  return fallbackCopyToClipboard(text);
}

function fallbackCopyToClipboard(text: string): { success: boolean } {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);

    return { success: successful };
  } catch {
    return { success: false };
  }
}
