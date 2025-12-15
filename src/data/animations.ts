import { AnimationTheme } from '@/types';

const baseStripConfig = {
    record_rack: { start: 0, stop: 48, channelSet: 0, brightness: 255 },
    cabinet_accent: { start: 48, stop: 96, channelSet: 0, brightness: 255 },
    titlestrips_bottom: { start: 96, stop: 144, channelSet: 0, brightness: 255 },
    titlestrips_top: { start: 144, stop: 192, channelSet: 0, brightness: 255 },
    extra_leds: { start: 192, stop: 204, channelSet: 0, brightness: 255 },
    cabinet_ami_logo: { start: 204, stop: 236, channelSet: 0, brightness: 255 },
    door_light: { start: 0, stop: 60, channelSet: 1, brightness: 255 },
};

// record_rack - facing down on the records in cabinet
// cabinet_accent - facing up toward the ceiling
// titlestrips_bottom - facing the bottom of the title strips
// titlestrips_top - facing the top of the title strips
// extra_leds - extra needs to be off
// cabinet_ami_logo - cabinet outside logo top middle

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
    original: createStripConfig(1000 / 30),
    fadeInOut: createStripConfig(25),
    cylonEye: createStripConfig(25),
    pacman: createStripConfig(30),
};

export const animationNames = Object.keys(animationThemes);
