interface Config {
  width: number;
  height: number;
}

/**
 *
 * Converts the DisplacementMap to a data URI for use in feImage href
 */
export function getDisplacementMapDataUri(mapConfig: Config): string {
  const { width, height } = mapConfig;
  const config = {
    width,
    height,
    // converted from jh3y's
    blur: 9,
    radius: 0,
    alpha: 0.93,
    lightness: 50,
    blend: "difference",
    border: 1,
  };
  const border = Math.min(width, height) * config.border;

  // Render to string (simplified - in production you'd use renderToString)
  const svgString = `<svg class="displacement-image" viewBox="0 0 ${config.width} ${
    config.height
  }" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="red" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#000"/>
          <stop offset="100%" stop-color="red"/>
        </linearGradient>
        <linearGradient id="blue" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#000"/>
          <stop offset="100%" stop-color="blue"/>
        </linearGradient>
      </defs>
      <!-- backdrop -->
      <rect x="0" y="0" width="${config.width}" height="${
        config.height
      }" fill="black"></rect>
      <!-- red linear -->
      <rect x="0" y="0" width="${config.width}" height="${config.height}" rx="${config.radius}" fill="url(#red)" />
      <!-- blue linear -->
      <rect x="0" y="0" width="${config.width}" height="${config.height}" rx="${config.radius}" fill="url(#blue)" style="mix-blend-mode: ${config.blend}" />
      <!-- block out distortion -->
      <rect x="${border}" y="${
        Math.min(config.width, config.height) * (config.border * 0.5)
      }" width="${config.width - border * 2}" height="${
        config.height - border * 2
      }" rx="${config.radius}" fill="hsl(0 0% ${config.lightness}% / ${config.alpha})" style="filter:blur(${config.blur}px)" />

    </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svgString)}`;
}
