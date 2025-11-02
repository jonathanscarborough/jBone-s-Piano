// Piano Web App - MIDI 48 (C3) to MIDI 60 (C4)

class Piano {
  constructor() {
    this.audioContext = null;
    this.activeNotes = new Map(); // Track active notes to allow releasing
    this.minMidi = 48; // C3
    this.maxMidi = 60; // C4
    
    // Keyboard mapping: key -> MIDI note
    this.keyMap = {
      'a': 48,  // C3
      'w': 49,  // C#3
      's': 50,  // D3
      'e': 51,  // D#3
      'd': 52,  // E3
      'f': 53,  // F3
      't': 54,  // F#3
      'g': 55,  // G3
      'y': 56,  // G#3
      'h': 57,  // A3
      'u': 58,  // A#3
      'j': 59,  // B3
      'k': 60   // C4
    };
    
    this.init();
  }

  init() {
    // Initialize Web Audio API (will be resumed on user interaction)
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      // Audio context starts in suspended state due to autoplay policy
      // It will be resumed on first user interaction
    } catch (e) {
      console.error('Web Audio API not supported:', e);
      return;
    }

    this.createKeys();
    this.attachEventListeners();
    this.setupAudioContextResume();
  }

  // Resume audio context on user interaction (required by browser autoplay policy)
  setupAudioContextResume() {
    const resumeAudio = () => {
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume().then(() => {
          console.log('Audio context resumed');
        }).catch(err => {
          console.error('Failed to resume audio context:', err);
        });
      }
    };

    // Resume on any user interaction
    document.addEventListener('click', resumeAudio, { once: true });
    document.addEventListener('keydown', resumeAudio, { once: true });
    document.addEventListener('touchstart', resumeAudio, { once: true });
  }

  // Convert MIDI note to frequency
  midiToFrequency(midiNote) {
    return 440 * Math.pow(2, (midiNote - 69) / 12);
  }

  // Get note name from MIDI note
  midiToNoteName(midiNote) {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(midiNote / 12) - 1;
    const note = notes[midiNote % 12];
    return `${note}${octave}`;
  }

  // Check if a MIDI note is a black key
  isBlackKey(midiNote) {
    const note = midiNote % 12;
    return [1, 3, 6, 8, 10].includes(note); // C#, D#, F#, G#, A#
  }

  // Generate a piano-like sound using multiple oscillators
  generatePianoSound(frequency) {
    const gainNode = this.audioContext.createGain();
    const masterGain = this.audioContext.createGain();
    
    // Main tone (sine wave)
    const osc1 = this.audioContext.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = frequency;
    
    // Harmonic (octave above - softer)
    const osc2 = this.audioContext.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = frequency * 2;
    
    // Second harmonic (fifth above - even softer)
    const osc3 = this.audioContext.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = frequency * 3;
    
    // Create an ADSR envelope for more realistic piano sound
    const now = this.audioContext.currentTime;
    const attackTime = 0.01;
    const decayTime = 0.1;
    const sustainLevel = 0.3;
    const releaseTime = 0.3;
    
    // Attack
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(1, now + attackTime);
    
    // Decay
    gainNode.gain.linearRampToValueAtTime(sustainLevel, now + attackTime + decayTime);
    
    // Sustain (held until release)
    gainNode.gain.setValueAtTime(sustainLevel, now + attackTime + decayTime);
    
    // Connect oscillators with different volumes for harmonics
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    osc3.connect(gainNode);
    
    osc2.gain = this.audioContext.createGain();
    osc3.gain = this.audioContext.createGain();
    osc2.connect(osc2.gain);
    osc3.connect(osc3.gain);
    osc2.gain.connect(gainNode);
    osc3.gain.connect(gainNode);
    
    osc2.gain.gain.value = 0.3; // Softer harmonic
    osc3.gain.gain.value = 0.15; // Even softer
    
    // Master volume
    masterGain.gain.value = 0.4;
    gainNode.connect(masterGain);
    masterGain.connect(this.audioContext.destination);
    
    // Start oscillators
    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    
    return {
      osc1,
      osc2,
      osc3,
      gainNode,
      masterGain,
      release: (releaseTime) => {
        const releaseNow = this.audioContext.currentTime;
        gainNode.gain.cancelScheduledValues(releaseNow);
        gainNode.gain.setValueAtTime(gainNode.gain.value, releaseNow);
        gainNode.gain.linearRampToValueAtTime(0, releaseNow + releaseTime);
        
        setTimeout(() => {
          osc1.stop();
          osc2.stop();
          osc3.stop();
        }, releaseTime * 1000);
      }
    };
  }

  // Play a note
  playNote(midiNote) {
    if (this.activeNotes.has(midiNote)) {
      return; // Note already playing
    }

    // Resume audio context if suspended (handles autoplay policy)
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(err => {
        console.error('Failed to resume audio context:', err);
      });
    }

    const frequency = this.midiToFrequency(midiNote);
    const sound = this.generatePianoSound(frequency);
    this.activeNotes.set(midiNote, sound);
    
    // Visual feedback
    const keyElement = document.querySelector(`[data-midi="${midiNote}"]`);
    if (keyElement) {
      keyElement.classList.add('pressed');
    }
  }

  // Stop a note
  stopNote(midiNote) {
    const sound = this.activeNotes.get(midiNote);
    if (sound) {
      sound.release(0.3);
      this.activeNotes.delete(midiNote);
    }
    
    // Remove visual feedback
    const keyElement = document.querySelector(`[data-midi="${midiNote}"]`);
    if (keyElement) {
      keyElement.classList.remove('pressed');
    }
  }

  // Create piano keys
  createKeys() {
    const piano = document.getElementById('piano');
    piano.innerHTML = '';

    // Create white keys first
    const whiteKeys = [];
    for (let midi = this.minMidi; midi <= this.maxMidi; midi++) {
      if (!this.isBlackKey(midi)) {
        whiteKeys.push(midi);
      }
    }

    // Create black keys
    const blackKeys = [];
    for (let midi = this.minMidi; midi <= this.maxMidi; midi++) {
      if (this.isBlackKey(midi)) {
        blackKeys.push(midi);
      }
    }

    // Create white key elements
    whiteKeys.forEach((midi, index) => {
      const key = document.createElement('div');
      key.className = 'key white-key';
      key.dataset.midi = midi;
      key.dataset.note = this.midiToNoteName(midi);
      
      const label = document.createElement('div');
      label.className = 'key-label';
      label.textContent = this.midiToNoteName(midi);
      
      const keyboardHint = document.createElement('div');
      keyboardHint.className = 'keyboard-hint';
      // Find keyboard key for this MIDI note
      const keyboardKey = Object.keys(this.keyMap).find(k => this.keyMap[k] === midi);
      if (keyboardKey) {
        keyboardHint.textContent = keyboardKey.toUpperCase();
      }
      
      key.appendChild(label);
      key.appendChild(keyboardHint);
      piano.appendChild(key);
    });

    // Insert black keys at appropriate positions
    blackKeys.forEach((midi) => {
      const key = document.createElement('div');
      key.className = 'key black-key';
      key.dataset.midi = midi;
      key.dataset.note = this.midiToNoteName(midi);
      
      const label = document.createElement('div');
      label.className = 'key-label';
      label.textContent = this.midiToNoteName(midi);
      
      const keyboardHint = document.createElement('div');
      keyboardHint.className = 'keyboard-hint';
      const keyboardKey = Object.keys(this.keyMap).find(k => this.keyMap[k] === midi);
      if (keyboardKey) {
        keyboardHint.textContent = keyboardKey.toUpperCase();
      }
      
      key.appendChild(label);
      key.appendChild(keyboardHint);
      
      // Find the position to insert black key
      // Black keys are positioned between certain white keys
      const whiteKeyElements = Array.from(piano.querySelectorAll('.white-key'));
      let insertPosition = -1;
      
      if (midi === 49) insertPosition = 0; // C#3 after C3
      else if (midi === 51) insertPosition = 1; // D#3 after D3
      else if (midi === 54) insertPosition = 3; // F#3 after F3
      else if (midi === 56) insertPosition = 4; // G#3 after G3
      else if (midi === 58) insertPosition = 5; // A#3 after A3
      
      if (insertPosition >= 0 && insertPosition < whiteKeyElements.length) {
        const nextWhiteKey = whiteKeyElements[insertPosition + 1];
        if (nextWhiteKey) {
          piano.insertBefore(key, nextWhiteKey);
        } else {
          piano.appendChild(key);
        }
      } else {
        piano.appendChild(key);
      }
    });
  }

  // Attach event listeners
  attachEventListeners() {
    const piano = document.getElementById('piano');
    
    // Mouse/touch events
    piano.addEventListener('mousedown', (e) => {
      const key = e.target.closest('.key');
      if (key) {
        const midi = parseInt(key.dataset.midi);
        this.playNote(midi);
      }
    });

    piano.addEventListener('mouseup', (e) => {
      const key = e.target.closest('.key');
      if (key) {
        const midi = parseInt(key.dataset.midi);
        this.stopNote(midi);
      }
    });

    piano.addEventListener('mouseleave', () => {
      // Stop all notes when mouse leaves piano
      this.activeNotes.forEach((sound, midi) => {
        this.stopNote(midi);
      });
    });

    // Touch events for mobile
    piano.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const key = e.target.closest('.key');
      if (key) {
        const midi = parseInt(key.dataset.midi);
        this.playNote(midi);
      }
    });

    piano.addEventListener('touchend', (e) => {
      e.preventDefault();
      const key = e.target.closest('.key');
      if (key) {
        const midi = parseInt(key.dataset.midi);
        this.stopNote(midi);
      }
    });

    // Keyboard events
    document.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      if (this.keyMap.hasOwnProperty(key) && !e.repeat) {
        const midi = this.keyMap[key];
        this.playNote(midi);
      }
    });

    document.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase();
      if (this.keyMap.hasOwnProperty(key)) {
        const midi = this.keyMap[key];
        this.stopNote(midi);
      }
    });
  }
}

// Initialize piano when page loads
document.addEventListener('DOMContentLoaded', () => {
  new Piano();
});

