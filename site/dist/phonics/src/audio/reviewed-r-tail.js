// User-requested 80 ms tail fade; original accepted cut remains preserved.
const finishing={
  "sourcePath": "assets/audio/recorded-phonemes/827cc1f0d3cd496a169d5cc7b5d5130b946d5210e320e29447589aa6a82fea10.wav",
  "sourceSha256": "827cc1f0d3cd496a169d5cc7b5d5130b946d5210e320e29447589aa6a82fea10",
  "path": "assets/audio/recorded-phonemes/33d884b420923e0acaef7aa223a58a266e38aa628526bd862af9d141d00b7000.wav",
  "sha256": "33d884b420923e0acaef7aa223a58a266e38aa628526bd862af9d141d00b7000",
  "bytes": 15194,
  "fadeOutMs": 80,
  "fadeCurve": "linear amplitude",
  "frames": 7575,
  "durationSeconds": 0.315625,
  "playbackVolume": 0.1,
  "status": "User accepted in chat, 4 November 2026",
  "originalPreserved": true
};
export function finishSound(recording){if(recording?.sha256!==finishing.sourceSha256)return recording;return {...recording,path:finishing.path,sha256:finishing.sha256,key:"finished:"+finishing.sha256,bytes:finishing.bytes,finishing};}
