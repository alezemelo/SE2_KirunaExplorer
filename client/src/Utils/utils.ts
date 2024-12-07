/**
 * Allows automatically generating a color from a string
 * @param str the string you want to convert to a color
 * @returns the HEX value for the color
 */
function stringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Generate RGB components
    let r = (hash >> 16) & 0xFF;
    let g = (hash >> 8) & 0xFF;
    let b = hash & 0xFF;

    // Avoid Earth Tones (Brown and Dark Green)
    r = avoidEarthTones(r, g, b, 'r');
    g = avoidEarthTones(r, g, b, 'g');
    b = avoidEarthTones(r, g, b, 'b');

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * 
 * Adjusts RGB values to avoid Earth Tones, otherwise they would blend in the satellite view
 * 
 * @param r - the red value
 * @param g - the green value
 * @param b - the blue value
 * @param channel - the channel to adjust
 * @returns adjusted value for specified channel
 */
function avoidEarthTones(r: number, g: number, b: number, channel: string) {
    // Earth tones ranges to avoid:
    // Brown: r=139-160, g=69-100, b=19-60
    // Dark Green: r=0-50, g=50-100, b=0-50
    // Dark Blue: r=0-50, g=0-50, b=100-150

    if (channel === 'g') {
        return 0; // Minimize the green channel to avoid green tones
    }

    if (channel === 'r' && r >= 139 && r <= 160 && g >= 69 && g <= 100 && b >= 19 && b <= 60) {
        // Brown: adjust red to avoid brown
        return (r + 50) % 256; // Shift red to prevent brown
    }

    if (channel === 'b' && r <= 50 && g <= 50 && b >= 100 && b <= 150) {
        // Dark Blue: adjust blue to avoid dark blue (seen in lakes/seas)
        return (b + 100) % 256; // Shift blue to prevent dark blue
    }

    return channel === 'b' ? (b + 100) % 256 : channel === 'g' ? (g + 50) % 256 : r;
}

export { stringToColor }