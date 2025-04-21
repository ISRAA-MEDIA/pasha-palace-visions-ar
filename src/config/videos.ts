
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

// Added YouTube IDs for first 6 exhibits as per provided links
export const VIDEOS_CONFIG: Record<string, VideoConfig> = {
  'exhibit01': {
    youtubeId: 'ALHZqz1fMrM', // fallback
    languages: {
      ar: 'ALHZqz1fMrM',
      en: '1VgJwBKnIxk',
      fr: 'UnSwaiO-w3I'
    }
  },
  'exhibit02': {
    youtubeId: 'oVmbtv-HNOc',
    languages: {
      ar: 'oVmbtv-HNOc',
      en: 'reX80Tv7Qmg',
      fr: 'JGBi1EKbCv4'
    }
  },
  'exhibit03': {
    youtubeId: 'PtR9jxxjq5o',
    languages: {
      ar: 'PtR9jxxjq5o',
      en: 'afsqJojYhI4',
      fr: 'kZ_LErCTC-U'
    }
  },
  'exhibit04': {
    youtubeId: 'ALHZqz1fMrM',
    languages: {
      ar: 'ALHZqz1fMrM',
      en: '1VgJwBKnIxk',
      fr: 'UnSwaiO-w3I'
    }
  },
  'exhibit05': {
    youtubeId: '-f3maE9RWhw',
    languages: {
      ar: '-f3maE9RWhw',
      en: '6HnwM0jLiIA',
      fr: 'dcrqYccoYQc'
    }
  },
  'exhibit06': {
    youtubeId: 'NFog8FSK4qk',
    languages: {
      ar: 'NFog8FSK4qk',
      en: 'JgiTVonAITQ',
      fr: 'cpTLJdcLFr8'
    }
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
