// MIDI Player using spessasynth_lib with SF2 soundfont
// Requires import map in the HTML page for spessasynth_lib and spessasynth_core
import { WorkletSynthesizer, Sequencer } from 'spessasynth_lib';

const WORKLET_URL = 'https://cdn.jsdelivr.net/npm/spessasynth_lib@4.1.3/dist/spessasynth_processor.min.js';

export class MidiPlayer {
  constructor(container, midiUrl, sf2Url) {
    this.container = container;
    this.midiUrl = midiUrl;
    this.sf2Url = sf2Url;
    this.synth = null;
    this.seq = null;
    this.audioContext = null;
    this.isLoaded = false;
    this.isSeeking = false;
    this.updateInterval = null;
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="mp-controls">
        <button class="mp-play-btn" aria-label="Play">
          <svg class="mp-icon-play" viewBox="0 0 24 24" width="28" height="28">
            <polygon points="6,3 20,12 6,21" fill="currentColor"/>
          </svg>
          <svg class="mp-icon-pause" viewBox="0 0 24 24" width="28" height="28" style="display:none">
            <rect x="5" y="3" width="4" height="18" fill="currentColor"/>
            <rect x="15" y="3" width="4" height="18" fill="currentColor"/>
          </svg>
        </button>
        <div class="mp-time mp-time-current">0:00</div>
        <div class="mp-progress-wrap">
          <input type="range" class="mp-progress" min="0" max="100" step="0.1" value="0">
          <div class="mp-progress-fill" style="width:0%"></div>
        </div>
        <div class="mp-time mp-time-total">0:00</div>
      </div>
      <div class="mp-status">Click play to load soundfont &amp; start playback</div>
    `;

    this.playBtn = this.container.querySelector('.mp-play-btn');
    this.iconPlay = this.container.querySelector('.mp-icon-play');
    this.iconPause = this.container.querySelector('.mp-icon-pause');
    this.timeCurrent = this.container.querySelector('.mp-time-current');
    this.timeTotal = this.container.querySelector('.mp-time-total');
    this.progress = this.container.querySelector('.mp-progress');
    this.progressFill = this.container.querySelector('.mp-progress-fill');
    this.status = this.container.querySelector('.mp-status');

    this.playBtn.addEventListener('click', () => this.togglePlay());

    this.progress.addEventListener('input', () => {
      this.isSeeking = true;
      const pct = this.progress.value / this.progress.max * 100;
      this.progressFill.style.width = pct + '%';
    });

    this.progress.addEventListener('change', () => {
      if (this.seq) {
        this.seq.currentTime = parseFloat(this.progress.value);
      }
      this.isSeeking = false;
    });
  }

  async load() {
    this.status.textContent = 'Loading soundfont (~31 MB)...';
    this.playBtn.disabled = true;

    try {
      this.audioContext = new AudioContext();
      await this.audioContext.audioWorklet.addModule(WORKLET_URL);

      this.synth = new WorkletSynthesizer(this.audioContext);

      const sfResponse = await fetch(this.sf2Url);
      if (!sfResponse.ok) throw new Error('Failed to load soundfont');
      const sfData = await sfResponse.arrayBuffer();
      await this.synth.soundBankManager.addSoundBank(sfData, 'main');

      // Wait for synth worklet to be fully initialized
      await this.synth.isReady;

      // Connect synth to audio output
      this.synth.connect(this.audioContext.destination);

      this.status.textContent = 'Loading MIDI...';

      // Create sequencer (synth only, MIDI loaded separately)
      this.seq = new Sequencer(this.synth);

      const midiResponse = await fetch(this.midiUrl);
      if (!midiResponse.ok) throw new Error('Failed to load MIDI');
      const midiData = await midiResponse.arrayBuffer();

      // Load MIDI into sequencer (expects {binary, fileName} objects)
      const fileName = this.midiUrl.split('/').pop();
      this.seq.loadNewSongList([{ binary: midiData, fileName }]);

      this.timeTotal.textContent = this.formatTime(this.seq.duration);
      this.progress.max = this.seq.duration;

      this.isLoaded = true;
      this.playBtn.disabled = false;
      this.status.textContent = 'Ready';

    } catch (err) {
      console.error('MIDI Player error:', err);
      this.status.textContent = 'Error: ' + err.message;
      this.playBtn.disabled = false;
    }
  }

  async togglePlay() {
    if (!this.isLoaded) {
      await this.load();
      if (!this.isLoaded) return;
    }

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    if (this.seq.paused) {
      this.seq.play();
      this.showPause();
      this.status.textContent = 'Playing';
      this.startUpdate();
    } else {
      this.seq.pause();
      this.showPlay();
      this.status.textContent = 'Paused';
      this.stopUpdate();
    }
  }

  showPlay() {
    this.iconPlay.style.display = '';
    this.iconPause.style.display = 'none';
  }

  showPause() {
    this.iconPlay.style.display = 'none';
    this.iconPause.style.display = '';
  }

  startUpdate() {
    this.stopUpdate();
    this.updateInterval = setInterval(() => {
      if (!this.seq || this.isSeeking) return;
      const t = this.seq.currentTime;
      this.timeCurrent.textContent = this.formatTime(t);
      this.progress.value = t;
      const pct = (t / this.seq.duration) * 100;
      this.progressFill.style.width = pct + '%';

      if (t >= this.seq.duration - 0.1) {
        this.showPlay();
        this.status.textContent = 'Finished';
        this.stopUpdate();
      }
    }, 100);
  }

  stopUpdate() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ':' + String(s).padStart(2, '0');
  }
}
