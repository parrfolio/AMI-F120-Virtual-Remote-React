import { AnimationTheme } from '@/types';

const baseStripConfig = {
    record_rack_top: { start: 0, stop: 48, channelSet: 0 },
    cabinet_accent_top: { start: 48, stop: 96, channelSet: 0 },
    titlestrips_bottom: { start: 96, stop: 144, channelSet: 0 },
    titlestrips_top: { start: 144, stop: 192, channelSet: 0 },
    extra_leds: { start: 192, stop: 204, channelSet: 0 },
    cabinet_ami_logo: { start: 204, stop: 236, channelSet: 0 },
    cabinet_accent_bottom_front: { start: 0, stop: 60, channelSet: 1 },
    record_rack_bottom: { start: 60, stop: 120, channelSet: 1 },
    door_light: { start: 120, stop: 143, channelSet: 1 },
    coin_light: { start: 143, stop: 151, channelSet: 1 },
};

// record_rack - facing down on the records in cabinet
// cabinet_accent - facing up toward the ceiling
// titlestrips_bottom - facing the bottom of the title strips
// titlestrips_top - facing the top of the title strips
// extra_leds - extra needs to be off
// cabinet_ami_logo - cabinet outside logo top middle

// `brightness` is applied on the Raspberry Pi when starting the theme.
// Lower values are recommended for all-white themes to avoid brownouts/voltage-drop color shifting.
const createStripConfig = (delay: number, brightness: number) => {
    return Object.entries(baseStripConfig).map(([name, config]) => ({
        name,
        delay,
        brightness,
        ...config,
    }));
};

export const animationThemes: AnimationTheme = {
    // Color themes can generally run brighter
    rainbow: createStripConfig(1000 / 30, 192),
    colorWave: createStripConfig(1000, 192),
    twinkle: createStripConfig(1000 / 30, 192),
    xmas: createStripConfig(500, 192),

    // White theme: keep lower by default
    classic: createStripConfig(1000 / 30, 128),

    fadeInOut: createStripConfig(25, 192),
    cylonEye: createStripConfig(25, 192),
    pacman: createStripConfig(30, 192),
};

export const animationNames = Object.keys(animationThemes);
