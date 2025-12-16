import { AnimationTheme } from '@/types';

// Note: `brightness` here is currently informational/legacy.
// Actual LED brightness on the Raspberry Pi is controlled server-side in
// `src/animations/strip.cjs` via `LED_BRIGHTNESS` (or its default).
const DEFAULT_STRIP_BRIGHTNESS = 192;

const baseStripConfig = {
    record_rack: { start: 0, stop: 48, channelSet: 0, brightness: DEFAULT_STRIP_BRIGHTNESS },
    cabinet_accent: { start: 48, stop: 96, channelSet: 0, brightness: DEFAULT_STRIP_BRIGHTNESS },
    titlestrips_bottom: { start: 96, stop: 144, channelSet: 0, brightness: DEFAULT_STRIP_BRIGHTNESS },
    titlestrips_top: { start: 144, stop: 192, channelSet: 0, brightness: DEFAULT_STRIP_BRIGHTNESS },
    extra_leds: { start: 192, stop: 204, channelSet: 0, brightness: DEFAULT_STRIP_BRIGHTNESS },
    cabinet_ami_logo: { start: 204, stop: 236, channelSet: 0, brightness: DEFAULT_STRIP_BRIGHTNESS },
    door_light: { start: 0, stop: 60, channelSet: 1, brightness: DEFAULT_STRIP_BRIGHTNESS },
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
    fadeInOut: createStripConfig(25),
    cylonEye: createStripConfig(25),
    pacman: createStripConfig(30),
};

export const animationNames = Object.keys(animationThemes);
