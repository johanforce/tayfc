import React, { useState } from 'react';
import { Article, MediaItem } from '../../types';
import { Newspaper, Video, Image as ImageIcon, Play, Clock, ArrowRight, X, ExternalLink, Plus } from 'lucide-react';

interface MediaAndNewsSectionProps {
  articles: Article[];
  mediaItems: MediaItem[];
  onPlayVideo: (url: string, title: string) => void;
  onGoToAdmin?: () => void;
}

export const MediaAndNewsSection: React.FC<MediaAndNewsSectionProps> = ({
  articles,
  mediaItems,
  onPlayVideo,
  onGoToAdmin
}) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeMediaTab, setActiveMediaTab] = useState<'news' | 'videos' | 'gallery'>('news');

  const videoItems = mediaItems.filter(m => m.type === 'VIDEO');
  const imageItems = mediaItems.filter(m => m.type === 'IMAGE');

  const totalMedia = articles.length + mediaItems.length;

  return (
    <section id="media" className="py-16 bg-slate-900/40 border-b border-slate-900 scroll-mt-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-amber-400 mb-1">
              <Newspaper className="w-4 h-4" />
              <span>Nội Dung Đa Phương Tiện & Truyền Thông</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Tin Tức, Video & Thư Viện Đa Phương Tiện
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Nội dung hình ảnh chất lượng cao và video highlights được quản lý tập trung từ hệ thống Firebase Storage.
            </p>
          </div>

          {/* Tab Selector if items exist */}
          {totalMedia > 0 && (
            <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-xl">
              <button
                onClick={() => setActiveMediaTab('news')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeMediaTab === 'news'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Bài viết ({articles.length})
              </button>
              <button
                onClick={() => setActiveMediaTab('videos')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeMediaTab === 'videos'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Video Highlights ({videoItems.length})
              </button>
              <button
                onClick={() => setActiveMediaTab('gallery')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  activeMediaTab === 'gallery'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Ảnh CLB ({imageItems.length})
              </button>
            </div>
          )}
        </div>

        {/* Global Empty State if totalMedia is 0 */}
        {totalMedia === 0 ? (
          <div className="p-12 text-center bg-slate-950/80 rounded-2xl border border-slate-800 text-slate-400 space-y-4 max-w-xl mx-auto shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 flex items-center justify-center mx-auto">
              <Newspaper className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Chưa có bài viết hoặc video nào</h3>
              <p className="text-xs text-slate-400 mt-1">
                Dữ liệu mẫu đã được xóa sạch. Bạn có thể thêm bài viết tin tức, video highlight và album ảnh trong Admin &gt; Firebase Media.
              </p>
            </div>
            {onGoToAdmin && (
              <button
                onClick={onGoToAdmin}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Bài Viết / Media Trong Admin</span>
              </button>
            )}
          </div>
        ) : (
          <>
            {/* TAB 1: ARTICLES & NEWS */}
            {activeMediaTab === 'news' && (
              articles.length === 0 ? (
                <div className="p-10 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400">
                  Chưa có bài viết tin tức nào được đăng tải.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => (
                    <div
                      key={article.id}
                      onClick={() => setSelectedArticle(article)}
                      className="group bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-video overflow-hidden bg-slate-900">
                          <img
                            src={article.coverImageUrl}
                            alt={article.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs text-amber-400 font-mono text-xs px-2.5 py-1 rounded-lg border border-slate-800">
                            {article.category}
                          </div>
                        </div>

                        <div className="p-5">
                          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                            <span>{new Date(article.publishedAt).toLocaleDateString('vi-VN')}</span>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {article.readTimeMinutes} phút đọc
                            </span>
                          </div>

                          <h3 className="font-heading font-bold text-base text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                            {article.title}
                          </h3>

                          <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                            {article.excerpt}
                          </p>
                        </div>
                      </div>

                      <div className="p-5 pt-0 flex items-center justify-between text-xs font-semibold text-amber-400">
                        <span>Đọc toàn bộ bài viết</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* TAB 2: VIDEOS & HIGHLIGHTS */}
            {activeMediaTab === 'videos' && (
              videoItems.length === 0 ? (
                <div className="p-10 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400">
                  Chưa có video highlights nào.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videoItems.map((video) => (
                    <div
                      key={video.id}
                      onClick={() => onPlayVideo(video.url, video.title)}
                      className="group relative bg-slate-950 border border-slate-800 hover:border-amber-400/50 rounded-2xl overflow-hidden shadow-xl cursor-pointer transition-all"
                    >
                      <div className="relative aspect-video bg-black overflow-hidden flex items-center justify-center">
                        {video.thumbnailUrl && (
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                          />
                        )}
                        <div className="absolute w-14 h-14 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-current ml-0.5" />
                        </div>

                        {video.duration && (
                          <div className="absolute bottom-3 right-3 bg-black/80 font-mono text-xs px-2 py-0.5 rounded text-white">
                            {video.duration}
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-mono">
                          <span className="text-amber-400">{video.category}</span>
                          <span>{new Date(video.uploadedAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <h3 className="font-heading font-bold text-base text-white group-hover:text-amber-400 transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                          {video.description}
                        </p>
                        {video.firebaseStoragePath && (
                          <div className="mt-3 text-[11px] font-mono text-slate-500 truncate">
                            Firebase: {video.firebaseStoragePath}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {/* TAB 3: PHOTO GALLERY */}
            {activeMediaTab === 'gallery' && (
              imageItems.length === 0 ? (
                <div className="p-10 text-center bg-slate-950 rounded-2xl border border-slate-800 text-slate-400">
                  Chưa có ảnh nào trong thư viện CLB.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {imageItems.map((img) => (
                    <div
                      key={img.id}
                      className="group bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                        <img
                          src={img.url}
                          alt={img.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2 bg-slate-950/80 text-[11px] px-2 py-0.5 rounded text-amber-400 font-mono">
                          {img.category}
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-heading font-bold text-sm text-slate-100">
                          {img.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {img.description}
                        </p>
                        {img.firebaseStoragePath && (
                          <span className="block mt-2 text-[10px] font-mono text-slate-500 truncate">
                            Path: {img.firebaseStoragePath}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}

        {/* Article Reader Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div 
              className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
                <span className="text-xs font-mono text-amber-400 uppercase">
                  {selectedArticle.category}
                </span>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto space-y-5">
                <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-slate-800">
                  <img
                    src={selectedArticle.coverImageUrl}
                    alt={selectedArticle.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>

                <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-white">
                  {selectedArticle.title}
                </h2>

                <div className="flex items-center gap-3 text-xs text-slate-400 pb-3 border-b border-slate-800">
                  <span>Tác giả: <strong className="text-slate-300">{selectedArticle.author}</strong></span>
                  <span>·</span>
                  <span>{new Date(selectedArticle.publishedAt).toLocaleDateString('vi-VN')}</span>
                  <span>·</span>
                  <span>{selectedArticle.readTimeMinutes} phút đọc</span>
                </div>

                <div className="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
                  {selectedArticle.content}
                </div>

                {selectedArticle.tags && (
                  <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2 text-xs text-slate-400">
                    <span>Thẻ bài viết:</span>
                    {selectedArticle.tags.map(t => (
                      <span key={t} className="bg-slate-950 px-2 py-0.5 rounded text-amber-400 font-mono">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg cursor-pointer"
                >
                  Đóng bài viết
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
