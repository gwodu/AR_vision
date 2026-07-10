(() => {
  let currentNode = 'start';
  let rapport = 50;
  let clarity = 50;

  const $ = (sel) => document.querySelector(sel);

  function init() {
    bindEvents();
  }

  function bindEvents() {
    $('#btn-start').addEventListener('click', start);
    $('#btn-exit').addEventListener('click', exit);
    $('#btn-restart')?.addEventListener('click', restart);
  }

  function playIntroSong() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        console.log('[audio] Web Audio not supported');
        return;
      }

      const ctx = new AudioCtx();

      // Helper to play a note with decent volume
      const playNote = (freq, startDelay, duration, wave = 'triangle', vol = 0.45) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = wave;
        osc.frequency.value = freq;

        filter.type = 'lowpass';
        filter.frequency.value = 2200;

        const masterGain = ctx.createGain();
        masterGain.gain.value = vol;

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);
        masterGain.connect(ctx.destination);

        const t = ctx.currentTime + startDelay;
        osc.start(t);

        // quick attack + decay
        gain.gain.value = vol * 0.1;
        gain.gain.linearRampToValueAtTime(vol, t + 0.02);
        gain.gain.linearRampToValueAtTime(0.001, t + duration);

        setTimeout(() => {
          try { osc.stop(); } catch (e) {}
        }, (startDelay + duration + 0.3) * 1000);
      };

      // Make sure context is running (required after user gesture)
      const startPlaying = () => {
        // A short primer note to unlock audio on some browsers
        playNote(880, 0.0, 0.08, 'sine', 0.3);

        // Main fun upbeat jingle (higher volume)
        playNote(523.25, 0.12, 0.18, 'triangle', 0.55); // C5
        playNote(659.25, 0.30, 0.18, 'triangle', 0.55); // E5
        playNote(783.99, 0.48, 0.18, 'triangle', 0.55); // G5
        playNote(1046.50, 0.66, 0.38, 'triangle', 0.65); // C6

        playNote(880.00, 1.12, 0.15, 'triangle', 0.5);  // A5
        playNote(987.77, 1.27, 0.15, 'triangle', 0.5);  // B5
        playNote(1046.50, 1.43, 0.45, 'triangle', 0.6); // C6

        // Bass line for fullness
        playNote(261.63, 0.10, 0.6, 'sine', 0.28);  // C4
        playNote(392.00, 0.75, 0.5, 'sine', 0.25);  // G4
      };

      if (ctx.state === 'suspended') {
        ctx.resume()
          .then(startPlaying)
          .catch(err => console.log('[audio] resume failed', err));
      } else {
        startPlaying();
      }
    } catch (e) {
      console.log('[audio] error playing intro', e);
    }
  }

  function start() {
    // Play intro song immediately on user gesture (click)
    playIntroSong();

    $('#landing').classList.remove('active');
    $('#scene-container').classList.add('active');

    SceneRenderer.buildMeetingRoom();
    SceneRenderer.setVisible(true);

    const camera = $('#camera');
    camera.setAttribute('position', '0 1.45 1.6');
    camera.setAttribute('rotation', '-8 0 0');
    camera.setAttribute('look-controls', 'enabled: true');

    rapport = 50;
    clarity = 50;
    currentNode = 'start';

    updateMeters();
    loadNode(currentNode);

    window.dispatchEvent(new Event('resize'));
  }

  function exit() {
    $('#scene-container').classList.remove('active');
    $('#landing').classList.add('active');
    hideEnding();

    // reset camera just in case
    const camera = $('#camera');
    camera.setAttribute('look-controls', 'enabled: false');
  }

  function restart() {
    hideEnding();
    currentNode = 'start';
    rapport = 50;
    clarity = 50;
    updateMeters();
    loadNode('start');
  }

  function loadNode(nodeId) {
    const node = SCENARIO.nodes[nodeId];
    if (!node) return;

    currentNode = nodeId;

    if (node.ending) {
      showEnding(node);
      return;
    }

    SceneRenderer.showDialogue(node);
    renderChoices(node.choices);
    updateMeters();
    $('#speaker-name').textContent = CHARACTERS[node.speaker]?.name || 'Alex';
    $('#speaker-role').textContent = CHARACTERS[node.speaker]?.role || '';
    $('#step-label').textContent = SCENARIO.title;
  }

  function renderChoices(choices) {
    const container = $('#choices');
    container.innerHTML = '';

    choices.forEach((choice, i) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice.text;
      btn.addEventListener('click', () => pickChoice(choice));
      btn.style.animationDelay = `${i * 80}ms`;
      container.appendChild(btn);
    });

    $('#choices-panel').classList.remove('hidden');
    $('#ending-panel').classList.add('hidden');
  }

  function pickChoice(choice) {
    rapport = clamp(rapport + (choice.rapport || 0) * 3, 0, 100);
    clarity = clamp(clarity + (choice.assert || 0) * 3, 0, 100);

    SceneRenderer.showPlayerChoice(choice.text);

    setTimeout(() => {
      updateMeters();
      loadNode(choice.next);
    }, 900);
  }

  function showEnding(node) {
    SceneRenderer.showDialogue(node);
    $('#choices-panel').classList.add('hidden');
    $('#ending-panel').classList.remove('hidden');

    const titles = {
      great: 'Well done',
      good: 'A good step',
      ok: 'Progress',
      walked: 'You walked away'
    };
    const colors = {
      great: '#7A8A6F',
      good: '#8B6642',
      ok: '#A89B7E',
      walked: '#6B665C'
    };

    $('#ending-title').textContent = titles[node.outcome] || 'Complete';
    $('#ending-title').style.color = colors[node.outcome] || '#F8F5F0';
    $('#ending-summary').textContent = node.summary;
    $('#ending-dialogue').textContent = node.text;
    updateMeters();
  }

  function hideEnding() {
    $('#ending-panel').classList.add('hidden');
  }

  function updateMeters() {
    $('#rapport-bar').style.width = `${rapport}%`;
    $('#assert-bar').style.width = `${clarity}%`;
    $('#rapport-val').textContent = rapport;
    $('#assert-val').textContent = clarity;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  document.addEventListener('DOMContentLoaded', init);
})();