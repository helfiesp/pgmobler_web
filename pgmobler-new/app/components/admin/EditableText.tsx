import { useFetcher } from "@remix-run/react";
import { useState, useRef, useEffect } from "react";

interface EditableTextProps {
  /** CMS key for this field */
  cmsKey: string;
  /** Current value */
  value: string;
  /** Whether admin edit mode is active */
  editMode: boolean;
  /** HTML tag to render */
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  /** Additional class names */
  className?: string;
  /** Use textarea instead of input */
  multiline?: boolean;
  /** Placeholder when empty */
  placeholder?: string;
}

export function EditableText({
  cmsKey,
  value,
  editMode,
  as: Tag = "span",
  className = "",
  multiline = false,
  placeholder = "Klikk for å redigere...",
}: EditableTextProps) {
  const fetcher = useFetcher();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  if (!editMode) {
    return <Tag className={className}>{value || ""}</Tag>;
  }

  if (editing) {
    const handleSave = () => {
      setEditing(false);
      if (text !== value) {
        fetcher.submit(
          { key: cmsKey, value: text, intent: "update-cms" },
          { method: "post", action: "/api/admin/cms" }
        );
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !multiline) handleSave();
      if (e.key === "Escape") {
        setText(value);
        setEditing(false);
      }
    };

    const sharedProps = {
      value: text,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setText(e.target.value),
      onBlur: handleSave,
      onKeyDown: handleKeyDown,
      className: `${className} w-full bg-white border-2 border-secondary rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-secondary/30`,
      placeholder,
    };

    return multiline ? (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        rows={3}
        {...sharedProps}
      />
    ) : (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        {...sharedProps}
      />
    );
  }

  return (
    <Tag
      className={`${className} editable-field`}
      onClick={() => setEditing(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") setEditing(true);
      }}
    >
      {value || <span className="text-muted italic">{placeholder}</span>}
    </Tag>
  );
}
