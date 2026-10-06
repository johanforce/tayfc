import { AppDatabase, FirebaseStorageConfig } from '../types';
import { INITIAL_DATABASE, EMPTY_DATABASE } from '../data/defaultData';

const LOCAL_STORAGE_KEY = 'football_club_user_database_v3';

export const storageService = {
  loadDatabase(): AppDatabase {
    try {
      // Clear legacy demo storage if present
      localStorage.removeItem('titans_saigon_fc_database_v1');
      
      const serialized = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!serialized) {
        this.saveDatabase(INITIAL_DATABASE);
        return INITIAL_DATABASE;
      }
      const parsed: AppDatabase = JSON.parse(serialized);
      return {
        ...INITIAL_DATABASE,
        ...parsed,
        clubInfo: { ...INITIAL_DATABASE.clubInfo, ...(parsed.clubInfo || {}) },
        firebaseConfig: { ...INITIAL_DATABASE.firebaseConfig, ...(parsed.firebaseConfig || {}) },
        players: Array.isArray(parsed.players) ? parsed.players : [],
        matches: Array.isArray(parsed.matches) ? parsed.matches : [],
        articles: Array.isArray(parsed.articles) ? parsed.articles : [],
        mediaItems: Array.isArray(parsed.mediaItems) ? parsed.mediaItems : []
      };
    } catch (e) {
      console.error('Failed to load database from localStorage, resetting to clean:', e);
      return INITIAL_DATABASE;
    }
  },

  saveDatabase(database: AppDatabase): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(database));
    } catch (e) {
      console.error('Failed to save database to localStorage:', e);
    }
  },

  clearAllData(): AppDatabase {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      localStorage.removeItem('titans_saigon_fc_database_v1');
    } catch (e) {
      console.error('Error clearing database:', e);
    }
    this.saveDatabase(EMPTY_DATABASE);
    return EMPTY_DATABASE;
  },

  resetToDefault(): AppDatabase {
    return this.clearAllData();
  },

  exportDatabaseJSON(database: AppDatabase): void {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(database, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `football_club_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  importDatabaseJSON(jsonString: string): AppDatabase {
    const parsed = JSON.parse(jsonString) as AppDatabase;
    if (!parsed.clubInfo || !Array.isArray(parsed.players) || !Array.isArray(parsed.matches)) {
      throw new Error('Dữ liệu JSON không hợp lệ hoặc thiếu cấu trúc câu lạc bộ bóng đá.');
    }
    this.saveDatabase(parsed);
    return parsed;
  },

  /**
   * Helper to format Firebase Storage path to accessible web URL
   */
  resolveFirebaseStorageUrl(pathOrUrl: string, config: FirebaseStorageConfig): string {
    if (!pathOrUrl) return '';
    if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://') || pathOrUrl.startsWith('/')) {
      return pathOrUrl;
    }

    let cleanPath = pathOrUrl;
    if (cleanPath.startsWith('gs://')) {
      const parts = cleanPath.replace('gs://', '').split('/');
      parts.shift();
      cleanPath = parts.join('/');
    }

    const encoded = encodeURIComponent(cleanPath);
    return `https://firebasestorage.googleapis.com/v0/b/${config.bucketName}/o/${encoded}?alt=media`;
  }
};
