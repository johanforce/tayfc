import React, { useState } from 'react';
import { FirebaseStorageConfig, MediaItem, Article } from '../../types';
import { storageService } from '../../services/storageService';
import { Cloud, Film, Image as ImageIcon, Newspaper, Plus, Edit2, Trash2, Check, Copy, ExternalLink, Play, Eye, X } from 'lucide-react';

interface FirebaseMediaManagerTabProps {
  firebaseConfig: FirebaseStorageConfig;
  mediaItems: MediaItem[];
  articles: Article[];
  onUpdateFirebaseConfig: (config: FirebaseStorageConfig) => void;
  onSaveMediaItem: (item: MediaItem) => void;
  onDeleteMediaItem: (itemId: string) => void;
  onSaveArticle: (article: Article) => void;
  onDeleteArticle: (articleId: string) => void;
  onPlayVideo: (url: string, title: string) => void;
}

export const FirebaseMediaManagerTab: React.FC<FirebaseMediaManagerTabProps> = ({
  firebaseConfig,
  mediaItems,
  articles,
  onUpdateFirebaseConfig,
  onSaveMediaItem,
  onDeleteMediaItem,
  onSaveArticle,
  onDeleteArticle,
  onPlayVideo
}) => {
  // Config state
  const [bucketName, setBucketName] = useState(firebaseConfig.bucketName);
  const [customDomain, setCustomDomain] = useState(firebaseConfig.customDomain || '');
  const [folderPrefix, setFolderPrefix] = useState(firebaseConfig.storageFolderPrefix);
  const [configSaved, setConfigSaved] = useState(false);

  // URL Generator helper state
  const [rawStoragePath, setRawStoragePath] = useState('media/videos/derby_highlights_v13.mp4');
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [previewMediaUrl, setPreviewMediaUrl] = useState<string | null>(null);

  // Modals state
  const [activeTab, setActiveTab] = useState<'config' | 'media' | 'articles'>('config');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaFormData, setMediaFormData] = useState<Partial<MediaItem>>({});

  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [articleFormData, setArticleFormData] = useState<Partial<Article>>({});

  // Handle saving config
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: FirebaseStorageConfig = {
      bucketName: bucketName.trim(),
      customDomain: customDomain.trim(),
      storageFolderPrefix: folderPrefix.trim(),
      enableProxy: false
    };
    onUpdateFirebaseConfig(updated);
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 3000);
  };

  // Convert raw path to public URL
  const handleGenerateUrl = () => {
    if (!rawStoragePath.trim()) return;
    const url = storageService.resolveFirebaseStorageUrl(rawStoragePath.trim(), {
      bucketName: bucketName.trim(),
      storageFolderPrefix: folderPrefix.trim(),
      enableProxy: false
    });
    setGeneratedUrl(url);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Open Media Modal
  const openCreateMediaModal = (type: 'VIDEO' | 'IMAGE') => {
    setMediaFormData({
      id: `med-${Date.now()}`,
      title: '',
      type,
      url: type === 'VIDEO' ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' : '/src/assets/images/match_derby_action_1791271050844.jpg',
      description: '',
      category: type === 'VIDEO' ? 'Highlight' : 'Trận đấu',
      uploadedAt: new Date().toISOString(),
      firebaseStoragePath: `media/${type.toLowerCase()}s/file_${Date.now()}.${type === 'VIDEO' ? 'mp4' : 'jpg'}`,
      duration: type === 'VIDEO' ? '04:30' : undefined
    });
    setIsMediaModalOpen(true);
  };

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaFormData.title || !mediaFormData.url) {
      alert('Vui lòng nhập tiêu đề và link file media.');
      return;
    }

    const saved: MediaItem = {
      id: mediaFormData.id || `med-${Date.now()}`,
      title: mediaFormData.title,
      type: mediaFormData.type || 'IMAGE',
      url: mediaFormData.url,
      thumbnailUrl: mediaFormData.thumbnailUrl || mediaFormData.url,
      description: mediaFormData.description || '',
      category: mediaFormData.category as any || 'Trận đấu',
      uploadedAt: mediaFormData.uploadedAt || new Date().toISOString(),
      firebaseStoragePath: mediaFormData.firebaseStoragePath || '',
      duration: mediaFormData.duration
    };

    onSaveMediaItem(saved);
    setIsMediaModalOpen(false);
  };

  // Open Article Modal
  const openCreateArticleModal = () => {
    setArticleFormData({
      id: `art-${Date.now()}`,
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImageUrl: '/src/assets/images/hero_match_atmosphere_1791271038678.jpg',
      category: 'Tin đội bóng',
      author: 'Ban Truyền Thông Titans FC',
      publishedAt: new Date().toISOString(),
      readTimeMinutes: 3,
      tags: ['Titans FC', 'V.League']
    });
    setIsArticleModalOpen(true);
  };

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleFormData.title || !articleFormData.content) {
      alert('Vui lòng nhập tiêu đề và nội dung bài viết.');
      return;
    }

    const saved: Article = {
      id: articleFormData.id || `art-${Date.now()}`,
      title: articleFormData.title,
      slug: articleFormData.title.toLowerCase().replace(/\s+/g, '-'),
      excerpt: articleFormData.excerpt || articleFormData.content.slice(0, 140) + '...',
      content: articleFormData.content,
      coverImageUrl: articleFormData.coverImageUrl || '/src/assets/images/hero_match_atmosphere_1791271038678.jpg',
      firebaseStorageRef: articleFormData.firebaseStorageRef,
      category: articleFormData.category as any || 'Tin đội bóng',
      author: articleFormData.author || 'Ban Truyền Thông',
      publishedAt: articleFormData.publishedAt || new Date().toISOString(),
      readTimeMinutes: Number(articleFormData.readTimeMinutes) || 3,
      tags: typeof articleFormData.tags === 'string'
        ? (articleFormData.tags as string).split(',').map((t: string) => t.trim())
        : (articleFormData.tags || [])
    };

    onSaveArticle(saved);
    setIsArticleModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-white flex items-center gap-2">
            <Cloud className="w-6 h-6 text-amber-400" />
            Quản Lý Firebase Storage & Nội Dung Đa Phương Tiện
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Cấu hình liên kết Firebase Storage cho video highlights, kho ảnh trận đấu và ảnh bài viết tin tức.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'config' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cài Đặt Storage
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'media' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Video & Ảnh ({mediaItems.length})
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'articles' ? 'bg-amber-400 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Bài Viết ({articles.length})
          </button>
        </div>
      </div>

      {/* TAB 1: FIREBASE CONFIGURATION & URL BUILDER */}
      {activeTab === 'config' && (
        <div className="space-y-6">
          {/* Config Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-heading font-bold text-base text-white mb-2 flex items-center gap-2">
              <Cloud className="w-5 h-5 text-emerald-400" />
              Cấu hình Firebase Storage Bucket
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Điền tên Firebase Bucket của dự án của bạn (ví dụ: <code className="text-amber-400">your-app.firebasestorage.app</code>). Hệ thống sẽ tự động tạo link tải công khai chuẩn của Google Firebase.
            </p>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">
                    Firebase Storage Bucket Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={bucketName}
                    onChange={(e) => setBucketName(e.target.value)}
                    placeholder="e.g. titans-saigon-fc.firebasestorage.app"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Tên bucket hiển thị trong Firebase Console &gt; Storage
                  </span>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1">
                    Thư mục tiền tố mặc định (Folder Prefix)
                  </label>
                  <input
                    type="text"
                    value={folderPrefix}
                    onChange={(e) => setFolderPrefix(e.target.value)}
                    placeholder="e.g. media/2026"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Đường dẫn thư mục chứa video và hình ảnh
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">
                  Custom Domain / Download Endpoint (Tùy chọn)
                </label>
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  placeholder="e.g. https://firebasestorage.googleapis.com/v0/b/titans-saigon-fc.firebasestorage.app/o"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                {configSaved && (
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-4 h-4" /> Đã cập nhật cấu hình Firebase Storage thành công!
                  </span>
                )}
                <div className="ml-auto">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl cursor-pointer shadow-md"
                  >
                    Lưu Cài Đặt Storage
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Helper: Convert Firebase Storage Path to Direct Link */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">
            <h3 className="font-heading font-bold text-base text-amber-400 mb-1">
              Công Cụ Tạo & Kiểm Tra Link Firebase Storage
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Dán đường dẫn tệp trong Storage (ví dụ: <code className="text-slate-200">media/videos/highlights_v13.mp4</code> hoặc <code className="text-slate-200">gs://...</code>), công cụ sẽ giải mã link HTTP tải trực tiếp cho trang web.
            </p>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={rawStoragePath}
                  onChange={(e) => setRawStoragePath(e.target.value)}
                  placeholder="Nhập đường dẫn Storage Path (e.g. news/derby.jpg)..."
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono focus:border-amber-400 focus:outline-none"
                />
                <button
                  onClick={handleGenerateUrl}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl cursor-pointer whitespace-nowrap"
                >
                  Tạo Link Tải Về
                </button>
              </div>

              {generatedUrl && (
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[11px] text-slate-400 uppercase font-mono block">
                    Link công khai tương thích trình duyệt (Web Public URL):
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedUrl}
                      className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 text-xs font-mono"
                    />
                    <button
                      onClick={() => copyToClipboard(generatedUrl)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs rounded-lg cursor-pointer flex items-center gap-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Đã chép' : 'Sao chép'}</span>
                    </button>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => setPreviewMediaUrl(generatedUrl)}
                      className="px-3 py-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-xs rounded-lg cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem thử ảnh/video</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MEDIA ITEMS (VIDEOS & IMAGES) */}
      {activeTab === 'media' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-white">
              Kho Video & Hình Ảnh Đội Bóng
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openCreateMediaModal('VIDEO')}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>+ Thêm Video</span>
              </button>
              <button
                onClick={() => openCreateMediaModal('IMAGE')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>+ Thêm Ảnh</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mediaItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    {item.type === 'VIDEO' ? (
                      <div
                        onClick={() => onPlayVideo(item.url, item.title)}
                        className="w-full h-full cursor-pointer flex items-center justify-center group"
                      >
                        {item.thumbnailUrl && (
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="w-full h-full object-cover opacity-80"
                          />
                        )}
                        <div className="absolute w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] bg-slate-950/80 font-mono text-amber-400">
                      {item.type} · {item.category}
                    </span>
                  </div>

                  <div className="p-4">
                    <h4 className="font-heading font-bold text-sm text-slate-100 line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                    {item.firebaseStoragePath && (
                      <div className="mt-2 text-[10px] font-mono text-slate-500 truncate" title={item.firebaseStoragePath}>
                        Firebase: {item.firebaseStoragePath}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 pt-0 flex items-center justify-between border-t border-slate-900 mt-2">
                  <span className="text-[11px] text-slate-500 font-mono">
                    {new Date(item.uploadedAt).toLocaleDateString('vi-VN')}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDeleteMediaItem(item.id)}
                      className="p-1.5 bg-slate-900 hover:bg-rose-950 text-rose-400 rounded-lg cursor-pointer"
                      title="Xóa media"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ARTICLES */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg text-white">
              Danh Sách Bài Viết & Tin Tức
            </h3>
            <button
              onClick={openCreateArticleModal}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Bài Viết Mới</span>
            </button>
          </div>

          <div className="space-y-3">
            {articles.map((art) => (
              <div
                key={art.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-12 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-slate-800">
                    <img
                      src={art.coverImageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-amber-400 font-mono">
                      <span>{art.category}</span>
                      <span>·</span>
                      <span className="text-slate-400">{new Date(art.publishedAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <h4 className="font-heading font-bold text-sm text-slate-100">
                      {art.title}
                    </h4>
                    <span className="text-xs text-slate-500">
                      Tác giả: {art.author}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    onClick={() => {
                      setArticleFormData(JSON.parse(JSON.stringify(art)));
                      setIsArticleModalOpen(true);
                    }}
                    className="p-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 rounded-lg cursor-pointer"
                    title="Chỉnh sửa bài viết"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteArticle(art.id)}
                    className="p-1.5 bg-slate-900 hover:bg-rose-950 text-rose-400 rounded-lg cursor-pointer"
                    title="Xóa bài viết"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE MEDIA MODAL */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div 
            className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <h3 className="font-heading font-bold text-base text-white">
                Thêm File Media Mới ({mediaFormData.type})
              </h3>
              <button
                onClick={() => setIsMediaModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMedia} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Tiêu đề media *</label>
                <input
                  type="text"
                  required
                  value={mediaFormData.title || ''}
                  onChange={(e) => setMediaFormData({ ...mediaFormData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Loại nội dung</label>
                <select
                  value={mediaFormData.type || 'VIDEO'}
                  onChange={(e) => setMediaFormData({ ...mediaFormData, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                >
                  <option value="VIDEO">Video Highlights / Hậu trường</option>
                  <option value="IMAGE">Ảnh Trận đấu / Tập luyện</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">URL Media (Link tải Firebase Storage hoặc URL công khai) *</label>
                <input
                  type="text"
                  required
                  value={mediaFormData.url || ''}
                  onChange={(e) => setMediaFormData({ ...mediaFormData, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Đường dẫn Firebase Storage (Tùy chọn)</label>
                <input
                  type="text"
                  value={mediaFormData.firebaseStoragePath || ''}
                  onChange={(e) => setMediaFormData({ ...mediaFormData, firebaseStoragePath: e.target.value })}
                  placeholder="e.g. media/videos/highlights_v13.mp4"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Mô tả tóm tắt</label>
                <textarea
                  rows={2}
                  value={mediaFormData.description || ''}
                  onChange={(e) => setMediaFormData({ ...mediaFormData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsMediaModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Lưu Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ARTICLE MODAL */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div 
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
              <h3 className="font-heading font-bold text-base text-white">
                {articleFormData.id ? 'Soạn Thảo Bài Viết' : 'Tạo Bài Viết Mới'}
              </h3>
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Tiêu đề bài viết *</label>
                <input
                  type="text"
                  required
                  value={articleFormData.title || ''}
                  onChange={(e) => setArticleFormData({ ...articleFormData, title: e.target.value })}
                  placeholder="e.g. Titans Saigon FC đại thắng trước kình địch..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Chuyên mục</label>
                  <select
                    value={articleFormData.category || 'Tin đội bóng'}
                    onChange={(e) => setArticleFormData({ ...articleFormData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                  >
                    <option value="Tin đội bóng">Tin đội bóng</option>
                    <option value="Phỏng vấn">Phỏng vấn</option>
                    <option value="Chuyển nhượng">Chuyển nhượng</option>
                    <option value="Chiến thuật">Chiến thuật</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Tác giả</label>
                  <input
                    type="text"
                    value={articleFormData.author || ''}
                    onChange={(e) => setArticleFormData({ ...articleFormData, author: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">URL Ảnh Bìa (Firebase Storage / Web URL) *</label>
                <input
                  type="text"
                  required
                  value={articleFormData.coverImageUrl || ''}
                  onChange={(e) => setArticleFormData({ ...articleFormData, coverImageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Tóm tắt ngắn (Excerpt)</label>
                <textarea
                  rows={2}
                  value={articleFormData.excerpt || ''}
                  onChange={(e) => setArticleFormData({ ...articleFormData, excerpt: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Nội dung chi tiết *</label>
                <textarea
                  rows={6}
                  required
                  value={articleFormData.content || ''}
                  onChange={(e) => setArticleFormData({ ...articleFormData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none font-sans leading-relaxed"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Lưu Bài Viết
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK PREVIEW POPUP */}
      {previewMediaUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center">
            <button
              onClick={() => setPreviewMediaUrl(null)}
              className="absolute top-3 right-3 p-1.5 bg-slate-800 text-slate-300 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
            <h4 className="font-heading font-bold text-sm text-white mb-3">Xem thử URL Media</h4>
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center">
              {previewMediaUrl.includes('.mp4') ? (
                <video src={previewMediaUrl} controls autoPlay className="w-full h-full object-contain" />
              ) : (
                <img src={previewMediaUrl} alt="Preview" className="w-full h-full object-contain" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
