import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize HTML for safe rendering (e.g. from rich text editor).
 * Allows common formatting tags and images.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s", "h2", "h3", "h4",
      "ul", "ol", "li", "blockquote", "a", "img",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "class", "target", "rel"],
  });
}
