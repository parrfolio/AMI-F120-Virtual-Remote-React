import { AnimationTheme } from '@/types';

const baseStripConfig = {
    title_striplight_1: { start: 0, stop: 60, channelSet: 0, brightness: 255 },
    title_striplight_2: { start: 60, stop: 120, channelSet: 0, brightness: 255 },
    main_cablight_1: { start: 120, stop: 180, channelSet: 0, brightness: 255 },
    main_cablight_2: { start: 180, stop: 240, channelSet: 0, brightness: 255 },
    back_mech_light: { start: 240, stop: 300, channelSet: 0, brightness: 155 },
    front_mech_light: { start: 0, stop: 60, channelSet: 1, brightness: 155 },
    door_light: { start: 60, stop: 120, channelSet: 1, brightness: 155 },
};

const createStripConfig = (delay: number) => {
    return Object.entries(baseStripConfig).map(([name, config]) => ({
        name,
        delay,
        ...config,
    }));
};

export const animationThemes: AnimationTheme = {
    rainbow: createStripConfig(1000 / 30),
    colorWave: createStripConfig(1000),
    twinkle: createStripConfig(1000 / 30),
    xmas: createStripConfig(500),
    classic: createStripConfig(1000 / 30),
    fadeInOut: createStripConfig(2000),
};

export const animationNames = Object.keys(animationThemes);
