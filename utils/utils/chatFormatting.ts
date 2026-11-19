// Chat content is text, never executable markup. Escape before formatting.
export const parseMarkdown = (text: string) => {
    let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/(\n\s*-\s)/g, '</li><li>')
        .replace(/<li>/, '<ul><li>');
    if ((html.match(/<ul>/g) || []).length > (html.match(/<\/ul>/g) || []).length) html += '</li></ul>';
    return html.split('\n').map(line => `<p>${line}</p>`).join('').replace(/<p><\/p>/g, '');
};
