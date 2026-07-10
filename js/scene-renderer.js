const SceneRenderer = (() => {
  let alexMii = null;
  let meetingWorld = null;

  function getWorld() {
    return document.getElementById('meeting-world');
  }

  function buildMeetingRoom() {
    const world = getWorld();
    world.innerHTML = '';

    const room = document.createElement('a-entity');
    room.setAttribute('id', 'room-group');

    const floor = document.createElement('a-plane');
    floor.setAttribute('width', 3);
    floor.setAttribute('height', 3);
    floor.setAttribute('rotation', '-90 0 0');
    floor.setAttribute('color', '#4A4134');
    floor.setAttribute('material', 'shader: flat');
    room.appendChild(floor);

    const rug = document.createElement('a-plane');
    rug.setAttribute('width', 1.8);
    rug.setAttribute('height', 1.4);
    rug.setAttribute('rotation', '-90 0 0');
    rug.setAttribute('position', '0 0.01 0');
    rug.setAttribute('color', '#5C4F3F');
    rug.setAttribute('material', 'shader: flat');
    room.appendChild(rug);

    const table = document.createElement('a-box');
    table.setAttribute('width', 1.2);
    table.setAttribute('height', 0.06);
    table.setAttribute('depth', 0.7);
    table.setAttribute('position', '0 0.55 0');
    table.setAttribute('color', '#6B5235');
    table.setAttribute('material', 'shader: flat');
    room.appendChild(table);

    const tableLeg1 = makeLeg('0.45 0.28 0.25');
    const tableLeg2 = makeLeg('-0.45 0.28 0.25');
    const tableLeg3 = makeLeg('0.45 0.28 -0.25');
    const tableLeg4 = makeLeg('-0.45 0.28 -0.25');
    room.appendChild(tableLeg1);
    room.appendChild(tableLeg2);
    room.appendChild(tableLeg3);
    room.appendChild(tableLeg4);

    const laptop = document.createElement('a-box');
    laptop.setAttribute('width', 0.3);
    laptop.setAttribute('height', 0.02);
    laptop.setAttribute('depth', 0.22);
    laptop.setAttribute('position', '0.15 0.59 -0.05');
    laptop.setAttribute('color', '#5C4F3F');
    laptop.setAttribute('material', 'shader: flat');
    room.appendChild(laptop);

    const plant = document.createElement('a-entity');
    plant.setAttribute('position', '-1 0 0.8');
    const pot = document.createElement('a-cylinder');
    pot.setAttribute('radius', 0.08);
    pot.setAttribute('height', 0.12);
    pot.setAttribute('position', '0 0.06 0');
    pot.setAttribute('color', '#E67E22');
    pot.setAttribute('material', 'shader: flat');
    plant.appendChild(pot);
    const leaves = document.createElement('a-sphere');
    leaves.setAttribute('radius', 0.15);
    leaves.setAttribute('position', '0 0.22 0');
    leaves.setAttribute('color', '#27AE60');
    leaves.setAttribute('material', 'shader: flat');
    leaves.setAttribute('scale', '1 1.2 1');
    plant.appendChild(leaves);
    room.appendChild(plant);

    const window = document.createElement('a-plane');
    window.setAttribute('width', 1.5);
    window.setAttribute('height', 1);
    window.setAttribute('position', '0 1.2 -1.4');
    window.setAttribute('color', '#C8B89A');
    window.setAttribute('material', 'shader: flat; opacity: 0.55; transparent: true');
    room.appendChild(window);

    // Real glTF model is used below (see important note about adding the file).

    // Load the Business Man model: https://poly.pizza/m/JFrLIKqvCH
    // 
    // IMPORTANT: The .glb file is NOT in this repo yet.
    // You must download it yourself and add it (see instructions below).
    //
    // Steps to include it in GitHub:
    // 1. Go to the link above
    // 2. Download the GLTF/GLB version
    // 3. Place it as: models/business-man.glb
    // 4. git add models/business-man.glb
    // 5. git commit && git push
    //
    // This is why it wasn't automatically "part of the folder" — the binary asset has to be downloaded and committed by you.
    alexMii = document.createElement('a-entity');
    alexMii.setAttribute('gltf-model', 'models/business-man.glb');
    alexMii.setAttribute('scale', '0.85 0.85 0.85');
    alexMii.setAttribute('position', '0.8 0 -0.6');
    alexMii.setAttribute('rotation', '0 -30 0');
    room.appendChild(alexMii);

    const speechBubble = document.createElement('a-entity');
    speechBubble.setAttribute('id', 'speech-bubble');
    speechBubble.setAttribute('position', '0.3 1.25 -0.5');

    const bubbleBg = document.createElement('a-plane');
    bubbleBg.setAttribute('width', 1.1);
    bubbleBg.setAttribute('height', 0.45);
    bubbleBg.setAttribute('color', '#ffffff');
    bubbleBg.setAttribute('material', 'shader: flat; opacity: 0.95; transparent: true');
    speechBubble.appendChild(bubbleBg);

    const bubbleTail = document.createElement('a-cone');
    bubbleTail.setAttribute('radius-bottom', 0.06);
    bubbleTail.setAttribute('height', 0.1);
    bubbleTail.setAttribute('position', '0 -0.28 0.1');
    bubbleTail.setAttribute('rotation', '180 0 0');
    bubbleTail.setAttribute('color', '#ffffff');
    bubbleTail.setAttribute('material', 'shader: flat');
    speechBubble.appendChild(bubbleTail);

    const bubbleText = document.createElement('a-text');
    bubbleText.setAttribute('id', 'bubble-text');
    bubbleText.setAttribute('value', '...');
    bubbleText.setAttribute('align', 'center');
    bubbleText.setAttribute('color', '#3A362F');
    bubbleText.setAttribute('width', 1);
    bubbleText.setAttribute('wrap-count', 32);
    bubbleText.setAttribute('position', '0 0 0.01');
    speechBubble.appendChild(bubbleText);

    room.appendChild(speechBubble);

    world.appendChild(room);
    meetingWorld = room;

    room.setAttribute('animation__enter', 'property: scale; from: 0.3 0.3 0.3; to: 1 1 1; dur: 800; easing: easeOutElastic');
  }

  function makeLeg(pos) {
    const leg = document.createElement('a-cylinder');
    leg.setAttribute('radius', 0.03);
    leg.setAttribute('height', 0.5);
    leg.setAttribute('position', pos);
    leg.setAttribute('color', '#6B4F10');
    leg.setAttribute('material', 'shader: flat');
    return leg;
  }

  function showDialogue(node) {
    const speaker = node.speaker;
    const bubble = document.getElementById('speech-bubble');
    const bubbleText = document.getElementById('bubble-text');

    if (bubbleText) {
      bubbleText.setAttribute('value', node.text);
    }

    if (speaker === 'alex') {
      bubble.setAttribute('position', '0.3 1.25 -0.5');
      bubble.setAttribute('visible', 'true');
      MiiCharacter.setSpeaking(alexMii, true);

      // Simple talking animation for the glTF model (head nod)
      if (alexMii && alexMii.getAttribute('gltf-model')) {
        alexMii.removeAttribute('animation__talk');
        alexMii.setAttribute('animation__talk', 'property: rotation; dur: 350; dir: alternate; loop: true; to: -27 -27 2; easing: easeInOutSine');
      }

      MiiCharacter.setMood(alexMii, node.mood || 'neutral');
    } else {
      // Player (first-person) - bubble on the near side
      bubble.setAttribute('position', '0 1.15 0.4');
      MiiCharacter.setSpeaking(alexMii, false);

      if (alexMii && alexMii.getAttribute('gltf-model')) {
        alexMii.removeAttribute('animation__talk');
      }
    }

    if (bubble) {
      bubble.setAttribute('animation__pop', 'property: scale; from: 0.5 0.5 0.5; to: 1 1 1; dur: 300; easing: easeOutBack');
    }
  }

  function showPlayerChoice(text) {
    const bubble = document.getElementById('speech-bubble');
    const bubbleText = document.getElementById('bubble-text');
    bubble.setAttribute('position', '0 1.15 0.4');
    bubble.setAttribute('visible', 'true');
    if (bubbleText) bubbleText.setAttribute('value', text);
    const speakerName = document.getElementById('speaker-name');
    const speakerRole = document.getElementById('speaker-role');
    if (speakerName) speakerName.textContent = 'You';
    if (speakerRole) speakerRole.textContent = '';
    MiiCharacter.setSpeaking(alexMii, false);

    if (alexMii && alexMii.getAttribute('gltf-model')) {
      alexMii.removeAttribute('animation__talk');
    }
  }

  function setVisible(visible) {
    getWorld().setAttribute('visible', visible);
  }

  return {
    buildMeetingRoom,
    showDialogue,
    showPlayerChoice,
    setVisible,
    getAlex: () => alexMii
  };
})();