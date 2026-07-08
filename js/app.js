(() => {
  let currentNode = 'start';
  let rapport = 50;
  let assertiveness = 50;
  let isARMode = false;
  let placed = false;
  let dialogueStarted = false;

  const $ = (sel) => document.querySelector(sel);

  function init() {
    bindEvents();
    initPreview();
    checkARSupport();
  }

  async function checkARSupport() {
    const btn = $('#btn-start-ar');
    if (!btn) return;
    if (!navigator.xr) {
      btn.disabled = true;
      btn.title = 'AR requires WebXR (use Android Chrome)';
      return;
    }
    try {
      const supported = await navigator.xr.isSessionSupported('immersive-ar');
      if (!supported) {
        btn.disabled = true;
        btn.title = 'AR not supported on this device/browser';
      }
    } catch (e) {
      // leave enabled; enter will fail gracefully
    }
  }

  function initPreview() {
    const preview = document.getElementById('preview-scene');
    if (!preview) return;

    function populatePreview() {
      const previewWorld = document.getElementById('preview-world');
      if (!previewWorld || previewWorld.querySelector('.mii-character')) return;

      const alex = MiiCharacter.create({ ...CHARACTERS.alex, scale: 0.85 });
      alex.setAttribute('position', '-0.4 0 0');
      alex.setAttribute('rotation', '0 25 0');
      previewWorld.appendChild(alex);

      const you = MiiCharacter.create({ ...CHARACTERS.you, scale: 0.85 });
      you.setAttribute('position', '0.4 0 0');
      you.setAttribute('rotation', '0 -25 0');
      previewWorld.appendChild(you);

      MiiCharacter.setSpeaking(alex, true);
      previewWorld.setAttribute('animation', 'property: rotation; to: 0 360 0; loop: true; dur: 16000; easing: linear');
    }

    if (preview.hasLoaded) populatePreview();
    else preview.addEventListener('loaded', populatePreview);
  }

  function bindEvents() {
    $('#btn-start-3d').addEventListener('click', () => startExperience(false));
    $('#btn-start-ar').addEventListener('click', handleStartAR);
    $('#btn-exit').addEventListener('click', exitExperience);
    $('#btn-restart')?.addEventListener('click', restart);
    $('#btn-place').addEventListener('click', placeMeeting);

    const scene = $('#main-scene');
    scene.addEventListener('surface-found', onSurfaceFound);
    scene.addEventListener('ar-placed', onARPlaced);
    scene.addEventListener('ar-ready', () => {
      if (isARMode) showPlacementUI();
    });
  }

  async function handleStartAR() {
    const btn = $('#btn-start-ar');
    // Quick support re-check (fast, non-interactive query)
    if (navigator.xr) {
      try {
        const supported = await navigator.xr.isSessionSupported('immersive-ar');
        if (!supported) {
          alert('Immersive AR not supported here. Please use "Start 3D Negotiation" or try on Android Chrome with ARCore enabled.');
          if (btn) btn.disabled = true;
          return;
        }
      } catch (e) {}
    }
    startExperience(true);
  }

  function startExperience(ar) {
    isARMode = ar;
    placed = !ar;
    dialogueStarted = !ar;
    currentNode = 'start';
    rapport = 50;
    assertiveness = 50;

    $('#landing').classList.remove('active');
    $('#scene-container').classList.add('active');

    SceneRenderer.buildMeetingRoom();
    SceneRenderer.setARScale(ar);
    SceneRenderer.setVisible(!ar);

    const scene = $('#main-scene');
    const camera = $('#camera');

    $('#choices-panel').classList.toggle('hidden', ar);
    $('#placement-hint').classList.toggle('hidden', !ar);
    $('#btn-place').disabled = true;
    $('#hint-main').textContent = 'Point your phone at a flat surface';
    $('#hint-sub').textContent = 'Move slowly until the purple ring appears';

    if (ar) {
      camera.setAttribute('position', '0 1.6 0');
      camera.setAttribute('look-controls', 'enabled: false');
      camera.setAttribute('wasd-controls', 'enabled: false');

      // Call enterAR synchronously from the user gesture (after fast support check)
      // so the browser can prompt for camera permission and start immersive-ar session.
      if (scene.enterAR) {
        scene.enterAR();
      } else if (scene.enterVR) {
        scene.enterVR();
      }
    } else {
      $('#placement-hint').classList.add('hidden');
      SceneRenderer.setVisible(true);
      camera.setAttribute('position', '0 1.45 1.6');
      camera.setAttribute('rotation', '-8 0 0');
      camera.setAttribute('look-controls', 'enabled: true');
      updateMeters();
      loadNode(currentNode);
    }

    window.dispatchEvent(new Event('resize'));
  }

  function showPlacementUI() {
    $('#placement-hint').classList.remove('hidden');
    $('#choices-panel').classList.add('hidden');
  }

  function onSurfaceFound() {
    $('#btn-place').disabled = false;
    $('#hint-main').textContent = 'Surface detected!';
    $('#hint-sub').textContent = 'Tap the button below or tap anywhere on screen';
  }

  function placeMeeting() {
    const scene = $('#main-scene');
    const hitTest = scene.components['ar-placement'];
    if (hitTest && hitTest.confirmPlace(true)) return;
    finalizePlacement();
  }

  function onARPlaced() {
    finalizePlacement();
  }

  function finalizePlacement() {
    if (placed) return;
    placed = true;

    $('#placement-hint').classList.add('hidden');
    $('#ar-reticle').setAttribute('visible', 'false');
    SceneRenderer.setVisible(true);
    $('#choices-panel').classList.remove('hidden');

    if (!dialogueStarted) {
      dialogueStarted = true;
      updateMeters();
      loadNode(currentNode);
    }
  }

  function exitExperience() {
    placed = false;
    dialogueStarted = false;
    isARMode = false;

    $('#scene-container').classList.remove('active');
    $('#landing').classList.add('active');
    hideEnding();

    const scene = $('#main-scene');
    if (scene.exitAR) scene.exitAR();
    if (scene.exitVR) scene.exitVR();

    const sky = scene.querySelector('a-sky');
    if (sky) sky.setAttribute('visible', 'true');
  }

  function restart() {
    hideEnding();
    currentNode = 'start';
    rapport = 50;
    assertiveness = 50;
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
    assertiveness = clamp(assertiveness + (choice.assert || 0) * 3, 0, 100);

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
      great: 'Negotiation Master',
      good: 'Deal Closed',
      ok: 'Partial Win',
      walked: 'Walked Away'
    };
    const colors = {
      great: '#27AE60',
      good: '#4A90D9',
      ok: '#F39C12',
      walked: '#E74C3C'
    };

    $('#ending-title').textContent = titles[node.outcome] || 'Complete';
    $('#ending-title').style.color = colors[node.outcome] || '#fff';
    $('#ending-summary').textContent = node.summary;
    $('#ending-dialogue').textContent = node.text;
    updateMeters();
  }

  function hideEnding() {
    $('#ending-panel').classList.add('hidden');
  }

  function updateMeters() {
    $('#rapport-bar').style.width = `${rapport}%`;
    $('#assert-bar').style.width = `${assertiveness}%`;
    $('#rapport-val').textContent = rapport;
    $('#assert-val').textContent = assertiveness;
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  document.addEventListener('DOMContentLoaded', init);
})();