/**
 * Calculate pulse trains based on the AMI F-120 selection number (1-120)
 * 
 * According to the jukebox manual:
 * - Selection numbers 1-120 map to specific pulse train combinations
 * - First pulse train: 2-7 (increments every 20 selections)
 * - Second pulse train: 1-20 (cycles for each first pulse train value)
 * 
 * @param selection - The selection number (1-120)
 * @returns Tuple of [firstPulseTrain, secondPulseTrain]
 */
export function calculatePulseTrains(selection: number): [number, number] {
    // Ensure selection is within valid range
    const validSelection = Math.max(1, Math.min(120, selection));

    // Calculate first pulse train (2-7)
    // Selections 1-20: first=2, 21-40: first=3, 41-60: first=4, etc.
    const firstPulseTrain = Math.floor((validSelection - 1) / 20) + 2;

    // Calculate second pulse train (1-20)
    // Cycles through 1-20 for each group of first pulse train
    const secondPulseTrain = ((validSelection - 1) % 20) + 1;

    return [firstPulseTrain, secondPulseTrain];
}

/**
 * Get the selection number from pulse trains
 * (Inverse of calculatePulseTrains)
 * 
 * @param ptrains - Tuple of [firstPulseTrain, secondPulseTrain]
 * @returns The selection number (1-120)
 */
export function getSelectionFromPulseTrains(ptrains: [number, number]): number {
    const [first, second] = ptrains;

    // Validate pulse trains
    if (first < 2 || first > 7 || second < 1 || second > 20) {
        console.warn(`Invalid pulse trains: [${first}, ${second}]`);
        return 1;
    }

    // Calculate selection: ((first - 2) * 20) + second
    const selection = ((first - 2) * 20) + second;

    return Math.max(1, Math.min(120, selection));
}
