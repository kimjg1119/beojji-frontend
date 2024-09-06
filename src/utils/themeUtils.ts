export type Theme = 'light' |'dark';

export const themeColors = {
  dark: {
    background: 'bg-gray-900',
    text: 'text-gray-200',
    navBackground: 'bg-gray-800',
    cardBackground: 'bg-gray-800',
    cardHover: 'hover:bg-gray-700',
    buttonText: 'text-blue-400',
    buttonHover: 'hover:text-blue-300',
    headingText: 'text-white',
    accentPrimary: 'text-blue-400',
    accentSecondary: 'text-purple-400',
    borderColor: 'border-gray-700',
    inputBackground: 'bg-gray-700',
    inputText: 'text-gray-200',
    inputPlaceholder: 'placeholder-gray-400',
  },

  light: {
    background: 'bg-white',
    text: 'text-black',
    navBackground: 'bg-white',
    cardBackground: 'bg-white',
    cardHover: 'hover:bg-gray-700',
    buttonText: 'text-blue-400',
    buttonHover: 'hover:text-blue-300',
    headingText: 'text-white',
    accentPrimary: 'text-blue-400',
    accentSecondary: 'text-purple-400',
    borderColor: 'border-gray-700',
    inputBackground: 'bg-gray-700',
    inputText: 'text-gray-200',
    inputPlaceholder: 'placeholder-gray-400',
  }
};

export const getThemeColor = (theme: Theme, colorKey: keyof typeof themeColors[Theme]) => {
  return themeColors[theme][colorKey];
};