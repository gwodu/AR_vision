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
      if (!AudioCtx) return;

      const ctx = new AudioCtx();

      const resumeAndPlay = () => {
        const now = ctx.currentTime;

        const playNote = (freq, offset, dur, type = 'triangle', volume = 0.22) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = type;
          osc.frequency.value = freq;
          filter.type = 'lowpass';
          filter.frequency.value = 1600;

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          const startTime = now + offset;
          osc.start(startTime);
          gain.gain.value = volume;
          gain.gain.linearRampToValueAtTime(0.001, startTime + dur + 0.1);

          setTimeout(() => {
            try { osc.stop(); } catch (e) {}
          }, (offset + dur + 0.2) * 1000);
        };

        // fun, light-hearted intro jingle (schedules from currentTime)
        playNote(523, 0.00, 0.16);
        playNote(659, 0.18, 0.16);
        playNote(784, 0.36, 0.16);
        playNote(1046, 0.54, 0.32);

        playNote(880, 0.95, 0.13);
        playNote(988, 1.10, 0.13);
        playNote(1046, 1.26, 0.38);

        // soft bass
        playNote(262, 0.00, 0.55, 'sine', 0.09);
        playNote(392, 0.65, 0.45, 'sine', 0.08);
      };

      if (ctx.state === 'suspended') {
        ctx.resume().then(resumeAndPlay).catch(() => {});
      } else {
        resumeAndPlay();
      }
    } catch (e) {
      // audio not supported or blocked, skip silently
    }
  }

  function start() {
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

    // play a fun intro song when the experience begins
    playIntroSong();

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