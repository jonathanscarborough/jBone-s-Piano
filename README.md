# Playable Piano Web App

A beautiful, interactive web-based piano with a playable octave range from C3 (MIDI 48) to C4 (MIDI 60).

## Features

- 🎹 **13 Piano Keys**: Full octave from C3 to C4 plus one note
- 🎵 **Realistic Piano Sound**: Multi-oscillator audio generation with harmonics
- 🖱️ **Mouse/Touch Support**: Click or touch keys to play
- ⌨️ **Keyboard Support**: Use your computer keyboard to play
- 🎨 **Beautiful UI**: Modern gradient design with visual feedback
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices

## Keyboard Mapping

| Computer Key | Note | MIDI |
|-------------|------|------|
| A | C3 | 48 |
| W | C#3 | 49 |
| S | D3 | 50 |
| E | D#3 | 51 |
| D | E3 | 52 |
| F | F3 | 53 |
| T | F#3 | 54 |
| G | G3 | 55 |
| Y | G#3 | 56 |
| H | A3 | 57 |
| U | A#3 | 58 |
| J | B3 | 59 |
| K | C4 | 60 |

## Usage

### Running Locally

1. Simply open `index.html` in a modern web browser
2. No build process or server required!

### Playing the Piano

- **Mouse/Touch**: Click or tap any key to play
- **Keyboard**: Press the keys shown above (A, W, S, E, D, F, T, G, Y, H, U, J, K)
- **Hold**: Keep a key pressed to sustain the note

## Technical Details

### Audio Generation

The piano uses the Web Audio API to generate realistic piano sounds:
- Main tone with sine wave
- Harmonics for richer sound
- ADSR envelope (Attack, Decay, Sustain, Release) for natural piano response

### MIDI Range

- **Start**: MIDI 48 (C3)
- **End**: MIDI 60 (C4, Middle C)
- **Total Keys**: 13 notes (8 white keys, 5 black keys)

### Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support with touch events

## File Structure

```
piano-app/
├── index.html    # Main HTML structure
├── styles.css    # Piano styling and layout
├── piano.js      # Piano logic and audio generation
└── README.md     # This file
```

## Customization

### Changing the Octave Range

Edit `piano.js` and modify:
```javascript
this.minMidi = 48; // Change minimum MIDI note
this.maxMidi = 60; // Change maximum MIDI note
```

### Adjusting Sound

Modify the `generatePianoSound()` function to:
- Change oscillator types
- Adjust harmonic levels
- Modify ADSR envelope timings
- Change master volume

### Changing Keyboard Layout

Modify the `keyMap` object in `piano.js`:
```javascript
this.keyMap = {
  'a': 48,  // Your custom mapping
  // ...
};
```

## Future Enhancements

Potential features for future versions:
- Record and playback functionality
- Multiple octaves
- Different instrument sounds
- MIDI file import/export
- Save and load songs
- Visual effects when playing
- Metronome
- Chord detection and display

## License

This project is provided as-is for personal and educational use.

