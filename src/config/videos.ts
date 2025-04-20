export interface VideoConfig {
  youtubeId: string;
  title: string;
  description: string;
  languages?: {
    en: string;
    fr: string;
    ar: string;
  };
}

export const VIDEOS_CONFIG: Record<string, VideoConfig> = {
  'sample': {
    youtubeId: 'dQw4w9WgXcQ',
    title: 'The Grand Hall',
    description: 'Discover the ornate details of the main reception hall',
    languages: {
      en: 'dQw4w9WgXcQ',
      fr: 'dQw4w9WgXcQ',
      ar: 'dQw4w9WgXcQ',
    }
  },
  'dining': {
    youtubeId: 'wuQEFQ7oZzk',
    title: 'The Dining Chamber',
    description: 'Where elegant feasts were once served to distinguished guests',
  },
  'garden': {
    youtubeId: 'FtutLA63Cp8',
    title: 'The Palace Gardens',
    description: 'Explore the beautiful gardens surrounding the palace',
  },
  'library': {
    youtubeId: 'QH2-TGUlwu4',
    title: 'The Ancient Library',
    description: 'Home to thousands of rare manuscripts and historical documents',
  },
  'shorts': {
    youtubeId: 'Z0cDwBdAC5o',
    title: 'Museum Shorts',
    description: 'A quick glimpse into our museum experience',
  },
  'secret-passage': {
    youtubeId: 'BVPp8DLmdb0',
    title: 'The Hidden Passage',
    description: 'A glimpse into a secret corridor rarely seen by visitors',
  }
};
