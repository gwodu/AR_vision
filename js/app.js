(() => {
  let currentNode = 'start';
  let rapport = 50;
  let assertiveness = 50;
  let isARMode = false;
  let placed = false;

  const $ = (sel) => document.querySelector(sel);

  function init() {
    bindEvents();
    initPreview();
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
    $('#btn-start-ar').addEventListener('click', () => startExperience(true));
    $('#btn-exit').addEventListener('click', exitExperience);
    $('#btn-restart')?.addEventListener('click', restart);

    const scene = $('#main-scene');
    scene.addEventListener('enter-vr', () => {
      if (isARMode) $('#placement-hint').classList.remove('hidden');
    });

    scene.addEventListener('click', onSceneTap);
    scene.addEventListener('touchend', onSceneTap);
  }

  function startExperience(ar) {
    isARMode = ar;
    placed = !ar;
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

    if (ar) {
      $('#placement-hint').classList.remove('hidden');
      camera.setAttribute('position', '0 1.6 0');
      camera.setAttribute('look-controls', 'enabled: false');
      camera.setAttribute('wasd-controls', 'enabled: false');

      setTimeout(() => {
        if (scene.enterAR) scene.enterAR();
        else if (scene.enterVR) scene.enterVR();
      }, 300);
    } else {
      $('#placement-hint').classList.add('hidden');
      SceneRenderer.setVisible(true);
      camera.setAttribute('position', '0 1.45 1.6');
      camera.setAttribute('rotation', '-8 0 0');
      camera.setAttribute('look-controls', 'enabled: true');
      camera.setAttribute('wasd-controls', 'enabled: false');
      $('#meeting-world').setAttribute('position', '0 0 -1.8');
    }

    window.dispatchEvent(new Event('resize'));
    updateMeters();
    loadNode(currentNode);
  }

  function onSceneTap(evt) {
    if (!isARMode || placed) return;
    if (evt.target.closest?.('#overlay button, #overlay .choice-btn, #overlay .dialogue-panel')) return;

    placed = true;
    $('#placement-hint').classList.add('hidden');
    SceneRenderer.setVisible(true);

    const anchor = $('#ar-anchor');
    const pos = anchor.getAttribute('position');
    $('#meeting-world').setAttribute('position', `${pos.x} ${pos.y} ${pos.z - 0.5}`);
  }

  function exitExperience() {
    $('#scene-container').classList.remove('active');
    $('#landing').classList.add('active');
    hideEnding();

    const scene = $('#main-scene');
    if (scene.exitAR) scene.exitAR();
    if (scene.exitVR) scene.exitVR();
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
    $('#choices-panel').classList.remove('hidden');
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