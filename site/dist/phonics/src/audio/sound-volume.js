// User volume adjustments, 4 November, relative to original playback volume.
export function soundVolume(id){if(['m','alphabet-m'].includes(id))return 0.7;if(['r','alphabet-r'].includes(id))return 0.1;return id==='voiced-th'?0.5:1;}
