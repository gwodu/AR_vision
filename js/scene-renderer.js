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
    // The page shows multiple poses because this GLB contains several animation clips.
    // We use animation-mixer and auto-pick the best "idle" clip for standing still
    // and the best "interact/talk" clip as reaction when Alex speaks.
    // 
    // Check browser console (F12) after load — it will log available clips and what we picked.
    // The model file must be at models/business-man.glb (download from the link).
    alexMii = document.createElement('a-entity');
    alexMii.setAttribute('gltf-model', 'models/business-man.glb');
    alexMii.setAttribute('scale', '0.85 0.85 0.85');
    alexMii.setAttribute('position', '0.8 0 -0.6');
    alexMii.setAttribute('rotation', '0 -30 0');

    // Debug + control animations after load
    alexMii.addEventListener('model-loaded', () => {
      const mesh = alexMii.getObject3D('mesh');
      if (mesh && mesh.animations && mesh.animations.length > 0) {
        const clipNames = mesh.animations.map(a => a.name);
        console.log('Available animation clips in business-man.glb:', clipNames);

        // Automatically pick a good idle/stand clip
        let idleClip = mesh.animations.find(a =>
          /idle|stand|pose|rest/i.test(a.name)
        ) || mesh.animations[0];

        alexMii.setAttribute('animation-mixer', `clip: ${idleClip.name}; loop: repeat`);
        console.log('Using idle clip for standing still:', idleClip.name);
      } else {
        console.log('This GLB appears to have no animation clips (static pose).');
      }
    });

    room.appendChild(alexMii);

    const speechBubble = document.createElement('a-entity');
    speechBubble.setAttribute('id', 'speech-bubble');
    speechBubble.setAttribute('position', '0.3 1.25 -0.5');
    speechBubble.setAttribute('visible', 'false');

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

      // Note: interact reaction is triggered right after the user picks a choice
      // (see showPlayerChoice). No need to set it here again.

      MiiCharacter.setMood(alexMii, node.mood || 'neutral');
    } else {
      // Player side - no 3D bubble for player speech
      if (bubble) bubble.setAttribute('visible', 'false');
      MiiCharacter.setSpeaking(alexMii, false);

      if (alexMii && alexMii.getAttribute('gltf-model')) {
        if (alexMii.components['animation-mixer']) {
          const m = alexMii.getObject3D('mesh');
          let idle = null;
          if (m && m.animations) idle = m.animations.find(a => /idle|stand|pose|rest/i.test(a.name));
          const name = idle ? idle.name : 'idle';
          alexMii.setAttribute('animation-mixer', `clip: ${name}; loop: repeat`);
        }
      }
    }

    if (bubble) {
      bubble.setAttribute('animation__pop', 'property: scale; from: 0.5 0.5 0.5; to: 1 1 1; dur: 300; easing: easeOutBack');
    }
  }

  function showPlayerChoice(text) {
    // No 3D text bubble for the player's spoken choice anymore
    const bubble = document.getElementById('speech-bubble');
    if (bubble) bubble.setAttribute('visible', 'false');

    const speakerName = document.getElementById('speaker-name');
    const speakerRole = document.getElementById('speaker-role');
    if (speakerName) speakerName.textContent = 'You';
    if (speakerRole) speakerRole.textContent = '';

    // After user decision, play interact animation as reaction to the choice
    if (alexMii && alexMii.getAttribute('gltf-model')) {
      if (alexMii.components['animation-mixer']) {
        const m = alexMii.getObject3D('mesh');
        let reaction = null;
        if (m && m.animations) reaction = m.animations.find(a => /interact|talk|wave|nod|gesture|response/i.test(a.name));
        const name = reaction ? reaction.name : 'interact';
        alexMii.setAttribute('animation-mixer', `clip: ${name}; loop: once`);
        // Return to idle after the reaction
        setTimeout(() => {
          if (alexMii && alexMii.components['animation-mixer']) {
            const idleM = alexMii.getObject3D('mesh');
            let idleC = null;
            if (idleM && idleM.animations) idleC = idleM.animations.find(a => /idle|stand|pose|rest/i.test(a.name));
            const idleName = idleC ? idleC.name : 'idle';
            alexMii.setAttribute('animation-mixer', `clip: ${idleName}; loop: repeat`);
          }
        }, 2500);
      }
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