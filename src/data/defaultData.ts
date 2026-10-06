import { AppDatabase } from '../types';

export const EMPTY_DATABASE: AppDatabase = {
  clubInfo: {
    name: 'CÂU LẠC BỘ BÓNG ĐÁ',
    shortName: 'FC',
    tagline: 'Đoàn kết - Bản lĩnh - Chiến thắng',
    foundedYear: 2024,
    homeStadium: 'Sân Vận Động Chính',
    stadiumCapacity: '20.000 chỗ ngồi',
    headCoach: 'HLV Trưởng',
    assistantCoach: 'Trợ lý HLV',
    clubPresident: 'Chủ Tịch CLB',
    clubLogoUrl: '/src/assets/images/club_crest_logo_1791271026628.jpg',
    heroBannerUrl: '/src/assets/images/hero_match_atmosphere_1791271038678.jpg',
    primaryColor: '#0f172a',
    secondaryColor: '#f59e0b',
    trophyCabinet: [],
    contactEmail: 'lienhe@doibong.vn',
    contactPhone: '(+84) 123 456 789',
    address: 'Địa chỉ trụ sở câu lạc bộ',
    socialLinks: {
      facebook: '',
      youtube: '',
      tiktok: '',
      instagram: ''
    }
  },
  players: [],
  matches: [],
  articles: [],
  mediaItems: [],
  firebaseConfig: {
    bucketName: 'your-project-id.firebasestorage.app',
    customDomain: '',
    storageFolderPrefix: 'media/2026',
    enableProxy: false
  }
};

// Clean database is now the default
export const INITIAL_DATABASE: AppDatabase = EMPTY_DATABASE;
