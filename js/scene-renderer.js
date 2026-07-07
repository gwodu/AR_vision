const SceneRenderer = (() => {
  let youMii = null;
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
    floor.setAttribute('color', '#2C3E50');
    floor.setAttribute('material', 'shader: flat');
    room.appendChild(floor);

    const rug = document.createElement('a-plane');
    rug.setAttribute('width', 1.8);
    rug.setAttribute('height', 1.4);
    rug.setAttribute('rotation', '-90 0 0');
    rug.setAttribute('position', '0 0.01 0');
    rug.setAttribute('color', '#34495E');
    rug.setAttribute('material', 'shader: flat');
    room.appendChild(rug);

    const table = document.createElement('a-box');
    table.setAttribute('width', 1.2);
    table.setAttribute('height', 0.06);
    table.setAttribute('depth', 0.7);
    table.setAttribute('position', '0 0.55 0');
    table.setAttribute('color', '#8B6914');
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
    laptop.setAttribute('color', '#BDC3C7');
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
    window.setAttribute('color', '#85C1E9');
    window.setAttribute('material', 'shader: flat; opacity: 0.6; transparent: true');
    room.appendChild(window);

    youMii = MiiCharacter.create({ ...CHARACTERS.you, scale: 1 });
    youMii.setAttribute('position', '0 0 0.55');
    youMii.setAttribute('rotation', '0 180 0');
    room.appendChild(youMii);

    alexMii = MiiCharacter.create({ ...CHARACTERS.alex, scale: 1 });
    alexMii.setAttribute('position', '0 0 -0.55');
    alexMii.setAttribute('rotation', '0 0 0');
    room.appendChild(alexMii);

    const speechBubble = document.createElement('a-entity');
    speechBubble.setAttribute('id', 'speech-bubble');
    speechBubble.setAttribute('position', '0 1.15 -0.55');

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
    bubbleText.setAttribute('color', '#2C3E50');
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
      bubble.setAttribute('position', '0 1.15 -0.55');
      bubble.setAttribute('visible', 'true');
      MiiCharacter.setSpeaking(alexMii, true);
      MiiCharacter.setSpeaking(youMii, false);
      MiiCharacter.setMood(alexMii, node.mood || 'neutral');
      MiiCharacter.setMood(youMii, 'neutral');
    } else {
      bubble.setAttribute('position', '0 1.15 0.55');
      MiiCharacter.setSpeaking(youMii, true);
      MiiCharacter.setSpeaking(alexMii, false);
    }

    if (bubble) {
      bubble.setAttribute('animation__pop', 'property: scale; from: 0.5 0.5 0.5; to: 1 1 1; dur: 300; easing: easeOutBack');
    }
  }

  function showPlayerChoice(text) {
    const bubble = document.getElementById('speech-bubble');
    const bubbleText = document.getElementById('bubble-text');
    bubble.setAttribute('position', '0 1.15 0.55');
    bubble.setAttribute('visible', 'true');
    if (bubbleText) bubbleText.setAttribute('value', text);
    MiiCharacter.setSpeaking(youMii, true);
    MiiCharacter.setSpeaking(alexMii, false);
    MiiCharacter.setMood(youMii, 'happy');
  }

  function setARScale(isAR) {
    const world = getWorld();
    if (isAR) {
      world.setAttribute('scale', '0.35 0.35 0.35');
    } else {
      world.setAttribute('scale', '1 1 1');
    }
  }

  function setVisible(visible) {
    getWorld().setAttribute('visible', visible);
  }

  return {
    buildMeetingRoom,
    showDialogue,
    showPlayerChoice,
    setARScale,
    setVisible,
    getAlex: () => alexMii,
    getYou: () => youMii
  };
})();