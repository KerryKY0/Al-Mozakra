import React, { useState, useRef } from "react";
import { useStore } from "../services/store";
import { useI18n } from "../services/i18n";
import { Post, UserRole } from "../types";
import {
  Heart,
  MessageCircle,
  Trash2,
  Image,
  Video,
  Music,
  Send,
  X,
  Newspaper,
} from "lucide-react";

const PostsPage: React.FC = () => {
  const {
    posts,
    addPost,
    deletePost,
    likePost,
    addPostComment,
    currentUser,
    showToast,
  } = useStore();
  const { t, lang } = useI18n();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<
    "IMAGE" | "VIDEO" | "AUDIO" | undefined
  >(undefined);
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [showComments, setShowComments] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreatePost = () => {
    if (!currentUser || !content.trim()) return;
    const newPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      content: content.trim(),
      mediaUrl: mediaUrl || undefined,
      mediaType: mediaType,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };
    addPost(newPost);
    setContent("");
    setMediaType(undefined);
    setShowCreateForm(false);
    showToast(t("postPublished"));
  };

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      showToast(t("fileTooLarge"));
      return;
    }
    const type: "IMAGE" | "VIDEO" | "AUDIO" = file.type.startsWith("image/")
      ? "IMAGE"
      : file.type.startsWith("video/")
        ? "VIDEO"
        : "AUDIO";
    setMediaType(type);
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setMediaUrl(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddComment = (postId: string) => {
    const text = commentTexts[postId];
    if (!text?.trim()) return;
    addPostComment(postId, text.trim());
    setCommentTexts((prev) => ({ ...prev, [postId]: "" }));
  };

  const isAdmin =
    currentUser?.role === UserRole.ADMIN ||
    currentUser?.role === UserRole.SUB_ADMIN;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-main flex items-center gap-2">
          <Newspaper className="text-space-accent" size={28} /> {t("posts")}
        </h1>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-space-accent text-space-900 px-4 py-2 rounded-xl font-bold text-sm btn-glow btn-ripple"
        >
          + {t("addPost")}
        </button>
      </div>

      {/* Create Post Modal */}
      {showCreateForm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowCreateForm(false)}
        >
          <div
            className="bg-space-800 rounded-2xl border border-space-700 w-full max-w-lg shadow-2xl animate-fade-in-scale p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl text-main">{t("addPost")}</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-muted hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-32 bg-space-900 border border-space-700 rounded-xl p-4 text-main outline-none focus:border-space-accent resize-none text-sm"
              placeholder={t("writePostPlaceholder")}
              dir="auto"
            />
            {mediaUrl && (
              <div className="mt-3 relative">
                {mediaType === "IMAGE" && (
                  <img
                    src={mediaUrl}
                    alt="Preview"
                    className="max-h-40 rounded-lg object-cover"
                  />
                )}
                {mediaType === "VIDEO" && (
                  <video
                    src={mediaUrl}
                    className="max-h-40 rounded-lg"
                    controls
                  />
                )}
                {mediaType === "AUDIO" && (
                  <audio src={mediaUrl} className="w-full" controls />
                )}
                <button
                  onClick={() => {
                    setMediaUrl("");
                    setMediaType(undefined);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setMediaType("IMAGE");
                    fileInputRef.current?.click();
                  }}
                  className="p-2 bg-space-700 rounded-lg text-blue-400 hover:bg-space-600 btn-ripple"
                >
                  <Image size={18} />
                </button>
                <button
                  onClick={() => {
                    setMediaType("VIDEO");
                    fileInputRef.current?.click();
                  }}
                  className="p-2 bg-space-700 rounded-lg text-green-400 hover:bg-space-600 btn-ripple"
                >
                  <Video size={18} />
                </button>
                <button
                  onClick={() => {
                    setMediaType("AUDIO");
                    fileInputRef.current?.click();
                  }}
                  className="p-2 bg-space-700 rounded-lg text-purple-400 hover:bg-space-600 btn-ripple"
                >
                  <Music size={18} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*,video/*,audio/*"
                  onChange={handleMediaUpload}
                />
              </div>
              <button
                onClick={handleCreatePost}
                disabled={!content.trim()}
                className="bg-space-accent text-space-900 px-6 py-2 rounded-lg font-bold btn-glow btn-ripple disabled:opacity-50"
              >
                {t("publish")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-20">
          <Newspaper size={48} className="text-muted mx-auto mb-4 opacity-30" />
          <p className="text-muted">{t("noPostsYet")}</p>
        </div>
      ) : (
        <div className="space-y-4 stagger-children">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-space-800 rounded-2xl border border-space-700 overflow-hidden hover:border-space-700/80 transition-all"
            >
              {/* Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-space-700 flex items-center justify-center text-space-accent font-bold text-sm border border-space-700 shrink-0">
                    {post.userName.charAt(0)}
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-main text-sm truncate">
                      {post.userName}
                    </p>
                    <p className="text-[10px] text-muted">
                      {new Date(post.createdAt).toLocaleDateString(
                        lang === "ar" ? "ar-EG" : "en-US",
                      )}{" "}
                      •{" "}
                      {post.userRole === UserRole.ADMIN
                        ? t("developer")
                        : post.userRole === UserRole.SUB_ADMIN
                          ? t("subDeveloper")
                          : t("studentType")}
                    </p>
                  </div>
                </div>
                {(currentUser?.id === post.userId || isAdmin) && (
                  <button
                    onClick={() => {
                      deletePost(post.id);
                      showToast(t("deleted"));
                    }}
                    className="text-red-400 hover:bg-red-400/10 p-1.5 rounded shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="px-4 pb-3">
                <p className="text-main text-sm whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </p>
              </div>

              {/* Media */}
              {post.mediaUrl && (
                <div className="px-4 pb-3">
                  {post.mediaType === "IMAGE" && (
                    <img
                      src={post.mediaUrl}
                      alt=""
                      className="w-full rounded-xl max-h-96 object-cover"
                    />
                  )}
                  {post.mediaType === "VIDEO" && (
                    <video
                      src={post.mediaUrl}
                      className="w-full rounded-xl max-h-96"
                      controls
                    />
                  )}
                  {post.mediaType === "AUDIO" && (
                    <audio src={post.mediaUrl} className="w-full" controls />
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="px-4 py-3 border-t border-space-700 flex items-center gap-6">
                <button
                  onClick={() => likePost(post.id)}
                  className={`flex items-center gap-1.5 text-sm transition-all btn-ripple ${post.likes.includes(currentUser?.id || "") ? "text-red-400" : "text-muted hover:text-red-400"}`}
                >
                  <Heart
                    size={18}
                    fill={
                      post.likes.includes(currentUser?.id || "")
                        ? "currentColor"
                        : "none"
                    }
                  />
                  <span>{post.likes.length}</span>
                </button>
                <button
                  onClick={() =>
                    setShowComments((prev) => ({
                      ...prev,
                      [post.id]: !prev[post.id],
                    }))
                  }
                  className="flex items-center gap-1.5 text-sm text-muted hover:text-blue-400 transition-all"
                >
                  <MessageCircle size={18} />
                  <span>{post.comments.length}</span>
                </button>
              </div>

              {/* Comments */}
              {showComments[post.id] && (
                <div className="px-4 pb-4 border-t border-space-700 pt-3 animate-fade-in">
                  <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar mb-3">
                    {post.comments.map((c) => (
                      <div key={c.id} className="bg-space-900 rounded-lg p-2.5">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-space-accent text-xs">
                            {c.userName}
                          </span>
                          <span className="text-[10px] text-muted">
                            {new Date(c.createdAt).toLocaleDateString(
                              lang === "ar" ? "ar-EG" : "en-US",
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">{c.content}</p>
                      </div>
                    ))}
                    {post.comments.length === 0 && (
                      <p className="text-muted text-xs text-center py-2">
                        {t("noCommentsYet")}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentTexts[post.id] || ""}
                      onChange={(e) =>
                        setCommentTexts((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleAddComment(post.id)
                      }
                      className="flex-1 bg-space-900 border border-space-700 rounded-lg px-3 py-2 text-main text-sm outline-none focus:border-space-accent"
                      placeholder={t("writeComment")}
                      dir="auto"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="bg-space-accent text-space-900 p-2 rounded-lg btn-ripple"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostsPage;
