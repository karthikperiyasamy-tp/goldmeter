"use client";

import { useCallback, useEffect, useState } from "react";
import {
  isFirebaseConfigured,
  signInWithGoogle,
  onAuthChange,
} from "@/lib/firebase/client";
import {
  getComments,
  addComment,
  editComment,
  deleteComment,
  toggleLike,
  reportComment,
} from "@/lib/community/comments";
import type { Comment } from "@/types/community";
import type { User } from "firebase/auth";

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function Avatar({ name, photoURL, size = "sm" }: { name: string; photoURL: string | null; size?: "sm" | "md" }) {
  const dim = size === "md" ? "w-9 h-9" : "w-7 h-7";
  const textSize = size === "md" ? "text-xs" : "text-[10px]";
  if (photoURL) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={photoURL} alt="" referrerPolicy="no-referrer" className={`${dim} rounded-full border border-slate-200`} />
    );
  }
  return (
    <span className={`${dim} rounded-full border border-slate-200 bg-amber-100 text-amber-700 ${textSize} font-bold inline-flex items-center justify-center`}>
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

interface Props {
  target: string;
}

export default function CommentSection({ target }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fbReady = isFirebaseConfigured();

  useEffect(() => {
    if (!fbReady) { setAuthLoading(false); return; }
    const unsub = onAuthChange((u) => { setUser(u); setAuthLoading(false); });
    return unsub;
  }, [fbReady]);

  const loadComments = useCallback(async () => {
    if (!fbReady) { setLoading(false); return; }
    try {
      const data = await getComments(target);
      setComments(data);
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setLoading(false);
    }
  }, [target, fbReady]);

  useEffect(() => { loadComments(); }, [loadComments]);

  const topLevel = comments.filter((c) => !c.parentId);
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parentId === parentId).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const handleSubmit = async () => {
    if (!user || !text.trim() || submitting) return;
    setSubmitting(true);
    try {
      await addComment(target, null, user.uid, user.displayName || "User", user.photoURL, text.trim());
      setText("");
      await loadComments();
    } catch (err) {
      console.error("Failed to add comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId: string) => {
    if (!user || !replyText.trim() || submitting) return;
    setSubmitting(true);
    try {
      await addComment(target, parentId, user.uid, user.displayName || "User", user.photoURL, replyText.trim());
      setReplyTo(null);
      setReplyText("");
      await loadComments();
    } catch (err) {
      console.error("Failed to add reply:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!editText.trim() || submitting) return;
    setSubmitting(true);
    try {
      await editComment(commentId, editText.trim());
      setEditingId(null);
      setEditText("");
      await loadComments();
    } catch (err) {
      console.error("Failed to edit comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || submitting) return;
    setSubmitting(true);
    try {
      await deleteComment(deleteTarget);
      setDeleteTarget(null);
      await loadComments();
    } catch (err) {
      console.error("Failed to delete comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (comment: Comment) => {
    if (!user) return;
    const isLiked = comment.likedBy.includes(user.uid);
    try {
      await toggleLike(comment.id, user.uid, isLiked);
      await loadComments();
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleReport = async (commentId: string) => {
    if (!user) return;
    try {
      await reportComment(commentId, user.uid);
      await loadComments();
    } catch (err) {
      console.error("Failed to report comment:", err);
    }
  };

  const canEdit = (c: Comment) =>
    user?.uid === c.uid && Date.now() - new Date(c.createdAt).getTime() < 24 * 60 * 60 * 1000;

  const renderComment = (c: Comment, isReply = false) => {
    const isEditing = editingId === c.id;
    const isOwn = user?.uid === c.uid;
    const liked = user ? c.likedBy.includes(user.uid) : false;
    const reported = user ? c.reportedBy.includes(user.uid) : false;

    return (
      <div key={c.id} className={`${isReply ? "ml-8 border-l-2 border-slate-100 pl-4" : ""}`}>
        <div className="flex gap-2.5 py-3">
          <Avatar name={c.displayName} photoURL={c.photoURL} size={isReply ? "sm" : "md"} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-charcoal">{c.displayName}</span>
              <span className="text-[10px] text-slate-400">{timeAgo(c.createdAt)}</span>
              {c.updatedAt !== c.createdAt && <span className="text-[10px] text-slate-400 italic">(edited)</span>}
            </div>

            {isEditing ? (
              <div className="mt-1.5">
                <textarea
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 resize-none"
                  rows={2}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <div className="flex gap-2 mt-1.5">
                  <button onClick={() => handleEdit(c.id)} disabled={submitting || !editText.trim()}
                    className="text-[11px] font-medium text-amber-600 hover:text-amber-700 disabled:opacity-40">Save</button>
                  <button onClick={() => { setEditingId(null); setEditText(""); }}
                    className="text-[11px] font-medium text-slate-400 hover:text-slate-600">Cancel</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-700 mt-0.5 whitespace-pre-wrap">{c.text}</p>
            )}

            {!isEditing && (
              <div className="flex items-center gap-3 mt-1.5">
                <button onClick={() => handleLike(c)} disabled={!user}
                  className={`text-[11px] font-medium transition-colors ${liked ? "text-amber-600" : "text-slate-400 hover:text-amber-600"} disabled:opacity-40`}>
                  {liked ? "♥" : "♡"} {c.likes > 0 && c.likes}
                </button>
                {!isReply && user && (
                  <button onClick={() => { setReplyTo(replyTo === c.id ? null : c.id); setReplyText(""); }}
                    className="text-[11px] font-medium text-slate-400 hover:text-amber-600 transition-colors">Reply</button>
                )}
                {isOwn && canEdit(c) && (
                  <button onClick={() => { setEditingId(c.id); setEditText(c.text); }}
                    className="text-[11px] font-medium text-slate-400 hover:text-amber-600 transition-colors">Edit</button>
                )}
                {isOwn && (
                  <button onClick={() => setDeleteTarget(c.id)}
                    className="text-[11px] font-medium text-slate-400 hover:text-red-500 transition-colors">Delete</button>
                )}
                {user && !isOwn && !reported && (
                  <button onClick={() => handleReport(c.id)}
                    className="text-[11px] font-medium text-slate-400 hover:text-red-500 transition-colors">Report</button>
                )}
                {reported && (
                  <span className="text-[10px] text-slate-400 italic">Reported</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reply form */}
        {replyTo === c.id && user && (
          <div className="ml-8 pl-4 border-l-2 border-amber-200 pb-2">
            <textarea
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-charcoal focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 resize-none"
              rows={2}
              placeholder={`Reply to ${c.displayName}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className="flex gap-2 mt-1.5">
              <button onClick={() => handleReply(c.id)} disabled={submitting || !replyText.trim()}
                className="rounded-full bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-amber-700 transition-colors disabled:opacity-40">
                {submitting ? "Posting..." : "Reply"}
              </button>
              <button onClick={() => { setReplyTo(null); setReplyText(""); }}
                className="text-[11px] font-medium text-slate-400 hover:text-slate-600">Cancel</button>
            </div>
          </div>
        )}

        {/* Replies */}
        {!isReply && getReplies(c.id).map((r) => renderComment(r, true))}
      </div>
    );
  };

  if (!fbReady) return null;

  return (
    <section className="mt-8 print:hidden">
      <h3 className="text-base font-bold text-charcoal mb-4">
        Comments {comments.length > 0 && <span className="text-slate-400 font-normal text-sm">({comments.length})</span>}
      </h3>

      {/* Comment form */}
      {authLoading ? null : user ? (
        <div className="flex gap-3 mb-4">
          <Avatar name={user.displayName || "U"} photoURL={user.photoURL} size="md" />
          <div className="flex-1">
            <textarea
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-charcoal placeholder:text-slate-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 resize-none"
              rows={3}
              placeholder="Share your thoughts..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <button onClick={handleSubmit} disabled={submitting || !text.trim()}
                className="rounded-full bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700 transition-colors disabled:opacity-40">
                {submitting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-amber-200 bg-amber-50/50 p-4 text-center mb-4">
          <p className="text-sm text-slate-600 mb-2">Sign in to join the discussion</p>
          <button onClick={() => signInWithGoogle().catch(console.error)}
            className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-all">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-200 border-t-amber-600" />
        </div>
      ) : topLevel.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-4">No comments yet. Be the first to share your thoughts!</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {topLevel.map((c) => renderComment(c))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl" role="dialog" aria-modal="true">
            <p className="text-base font-semibold text-charcoal">Delete this comment?</p>
            <p className="mt-2 text-sm text-slate-600">This action cannot be undone.</p>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setDeleteTarget(null)} disabled={submitting}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
              <button onClick={handleDelete} disabled={submitting}
                className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
                {submitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
