import { Link } from "@remix-run/react";

interface AdminBarProps {
  editMode: boolean;
  onToggleEditMode: () => void;
}

export function AdminBar({ editMode, onToggleEditMode }: AdminBarProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
      {/* Edit mode toggle */}
      <button
        onClick={onToggleEditMode}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-elevated text-sm font-medium transition-all ${
          editMode
            ? "bg-secondary text-white hover:bg-secondary/90"
            : "bg-white text-primary hover:bg-gray-50 border border-border"
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        {editMode ? "Redigeringsmodus PÅ" : "Rediger"}
      </button>

      {/* Admin dashboard link */}
      <Link
        to="/admin"
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white shadow-elevated text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Admin
      </Link>
    </div>
  );
}
