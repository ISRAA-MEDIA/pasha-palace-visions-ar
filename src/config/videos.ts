
export interface VideoConfig {
  youtubeId: string;
  title?: string; // Make title optional
  description?: string; // Make description optional
  languages?: {
    en: string;
    fr: string;
    ar: string;
  };
}

// Generate 20 blank entries for now
export const VIDEOS_CONFIG: Record<string, VideoConfig> = {
  'exhibit01': {
    youtubeId: '',
  },
  'exhibit02': {
    youtubeId: '',
  },
  'exhibit03': {
    youtubeId: '',
  },
  'exhibit04': {
    youtubeId: '',
  },
  'exhibit05': {
    youtubeId: '',
  },
  'exhibit06': {
    youtubeId: '',
  },
  'exhibit07': {
    youtubeId: '',
  },
  'exhibit08': {
    youtubeId: '',
  },
  'exhibit09': {
    youtubeId: '',
  },
  'exhibit10': {
    youtubeId: '',
  },
  'exhibit11': {
    youtubeId: '',
  },
  'exhibit12': {
    youtubeId: '',
  },
  'exhibit13': {
    youtubeId: '',
  },
  'exhibit14': {
    youtubeId: '',
  },
  'exhibit15': {
    youtubeId: '',
  },
  'exhibit16': {
    youtubeId: '',
  },
  'exhibit17': {
    youtubeId: '',
  },
  'exhibit18': {
    youtubeId: '',
  },
  'exhibit19': {
    youtubeId: '',
  },
  'exhibit20': {
    youtubeId: '',
  }
};
