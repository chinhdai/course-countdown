export const theme = {
    colors: {
        primary: '#007AFF', // iOS Blue
        primaryLight: '#E5F1FF',
        background: '#F2F2F7', // iOS Grouped Background
        card: '#FFFFFF',
        text: '#000000',
        textSecondary: 'rgba(60,60,67,0.6)', // iOS secondary label (60% opacity)
        border: '#C6C6C8',
        success: '#34C759', // iOS Green
        danger: '#FF3B30', // iOS Red
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    radius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        round: 9999,
    },
    shadows: {
        small: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
        },
        button: {
            shadowColor: '#007AFF',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 6,
        }
    }
};
