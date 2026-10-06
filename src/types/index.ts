export type PositionGroup = 'GK' | 'DF' | 'MF' | 'FW';

export interface PlayerStats {
  appearances: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  passAccuracy: number; // percentage
  tacklesWon?: number;
  shotsOnTarget?: number;
}

export interface Player {
  id: string;
  name: string;
  vietnameseName?: string;
  number: number;
  position: PositionGroup;
  subPosition: string; // e.g. "Thủ môn", "Trung vệ", "Hậu vệ cánh phải", "Tiền vệ phòng ngự", "Tiền đạo cánh"
  nationality: string;
  dateOfBirth: string;
  age: number;
  height: number; // cm
  weight: number; // kg
  preferredFoot: 'Phải' | 'Trái' | 'Cả hai';
  avatarUrl: string;
  marketValue: string; // e.g. "€350.000"
  joinedYear: number;
  contractUntil: string;
  isCaptain?: boolean;
  isViceCaptain?: boolean;
  bio: string;
  stats: PlayerStats;
  firebaseStorageImageRef?: string;
}

export type MatchStatus = 'UPCOMING' | 'LIVE' | 'FINISHED' | 'POSTPONED';

export interface MatchScorer {
  id: string;
  player: string;
  minute: number;
  isClubScorer: boolean;
  isPenalty?: boolean;
  isOwnGoal?: boolean;
}

export interface MatchEvent {
  id: string;
  minute: number;
  type: 'GOAL' | 'YELLOW' | 'RED' | 'SUB';
  player: string;
  subIn?: string;
  team: 'HOME' | 'AWAY';
  detail?: string;
}

export interface TacticalPitchPosition {
  positionCode: string; // 'GK', 'CB-L', 'CB-R', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'RW', 'LW', 'ST'
  playerId: string;
  x: number; // Percentage on pitch (0 - 100)
  y: number; // Percentage on pitch (0 - 100)
}

export interface Match {
  id: string;
  competition: string; // e.g. "V.League 1 2025/26", "Cúp Quốc Gia Bamboo Airways", "AFC Champions League Two"
  round: string; // "Vòng 14", "Bán kết", "Chung kết"
  datetime: string; // ISO date string e.g. "2026-10-18T19:15:00"
  venue: string; // "SVĐ Thống Nhất, TP.HCM"
  isHome: boolean;
  homeTeam: {
    name: string;
    shortName: string;
    logo: string;
    isClub: boolean;
  };
  awayTeam: {
    name: string;
    shortName: string;
    logo: string;
    isClub: boolean;
  };
  status: MatchStatus;
  score?: {
    home: number;
    away: number;
  };
  scorers?: MatchScorer[];
  events?: MatchEvent[];
  formation: string; // "4-3-3", "4-2-3-1", "3-5-2", "4-4-2"
  lineup: TacticalPitchPosition[];
  substitutes: string[]; // List of Player IDs
  highlightsUrl?: string; // Video URL (Firebase Storage or YouTube)
  streamUrl?: string;
  ticketUrl?: string;
  matchReport?: string;
  photoGalleryUrls?: string[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  firebaseStorageRef?: string;
  category: 'Tin đội bóng' | 'Phỏng vấn' | 'Chuyển nhượng' | 'Chiến thuật' | 'Thông báo';
  author: string;
  publishedAt: string;
  readTimeMinutes: number;
  tags: string[];
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'VIDEO' | 'IMAGE' | 'DOCUMENT';
  url: string;
  thumbnailUrl?: string;
  description: string;
  category: 'Trận đấu' | 'Tập luyện' | 'Hậu trường' | 'Phỏng vấn' | 'Highlight';
  uploadedAt: string;
  firebaseStoragePath?: string;
  duration?: string; // for videos e.g. "03:45"
  fileSize?: string;
}

export interface Trophy {
  id: string;
  title: string;
  season: string;
  description: string;
  iconName: string;
}

export interface ClubInfo {
  name: string;
  shortName: string;
  tagline: string;
  foundedYear: number;
  homeStadium: string;
  stadiumCapacity: string;
  headCoach: string;
  assistantCoach: string;
  clubPresident: string;
  clubLogoUrl: string;
  heroBannerUrl: string;
  primaryColor: string;
  secondaryColor: string;
  trophyCabinet: Trophy[];
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    facebook: string;
    youtube: string;
    tiktok: string;
    instagram: string;
  };
}

export interface FirebaseStorageConfig {
  bucketName: string; // e.g. "titans-saigon-fc.firebasestorage.app"
  customDomain?: string;
  storageFolderPrefix: string; // e.g. "media/2026"
  enableProxy: boolean;
}

export interface AppDatabase {
  clubInfo: ClubInfo;
  players: Player[];
  matches: Match[];
  articles: Article[];
  mediaItems: MediaItem[];
  firebaseConfig: FirebaseStorageConfig;
}
