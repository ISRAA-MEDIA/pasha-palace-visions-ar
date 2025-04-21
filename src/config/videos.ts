export interface VideoConfig {
  youtubeId: string;
  title?: string;
  description?: string;
  languages?: {
    en: string;
    fr: string;
    ar: string;
  };
}

export const VIDEOS_CONFIG: Record<string, VideoConfig> = {
  'exhibit01': {
    youtubeId: '60AQ_snhrIM', // fallback
    languages: {
      ar: '60AQ_snhrIM',
      en: 'swt7XqKpduQ',
      fr: 'NuXBw0j4VE4'
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
    youtubeId: 'ZyhVQucmIsw',
    languages: {
      ar: 'ZyhVQucmIsw',
      en: 'JL-8FybUyLg',
      fr: 'XRW9poJzw2M'
    }
  },
  'exhibit08': {
    youtubeId: 'UWb5OTHj0GM',
    languages: {
      ar: 'UWb5OTHj0GM',
      en: 'eBJSXsgS51A',
      fr: 'yHp4l_6gszg'
    }
  },
  'exhibit09': {
    youtubeId: 'DXHMsnKKZ5U',
    languages: {
      ar: 'DXHMsnKKZ5U',
      en: '1PlBcIhhUfE',
      fr: 'BwhbtWsX8g4'
    }
  },
  'exhibit10': {
    youtubeId: '1EHaXd7mKmI',
    languages: {
      ar: '1EHaXd7mKmI',
      en: 'jI-6GYd06BU',
      fr: 'VG_35B8uEOQ'
    }
  },
  'exhibit11': {
    youtubeId: 'OvROG_LWmcM',
    languages: {
      ar: 'OvROG_LWmcM',
      en: 'zrF_FIjHf0c',
      fr: 'hK7oA2guB_I'
    }
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
