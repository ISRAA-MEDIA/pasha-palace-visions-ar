
export interface VideoConfig {
  youtubeId: string;
  title: string;
  description: string;
}

export const VIDEOS_CONFIG: Record<string, VideoConfig> = {
  'sample': {
    youtubeId: 'dQw4w9WgXcQ',
    title: 'The Grand Hall',
    description: 'Discover the ornate details of the main reception hall',
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
  }
};
