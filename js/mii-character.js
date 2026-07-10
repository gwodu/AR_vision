const MiiCharacter = (() => {
  function part(tag, attrs) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    el.setAttribute('material', 'shader: flat');
    return el;
  }

  function createHand(skin, isLeft = false) {
    const group = document.createElement('a-entity');

    // palm (the circular ball should be "above" / closer to the arm than the fingers)
    const palm = part('a-sphere', {
      radius: 0.029, color: skin, position: '0 0.015 0'
    });
    group.appendChild(palm);

    const sign = isLeft ? -1 : 1;

    // 4 fingers - positioned below the palm (negative y)
    for (let i = 0; i < 4; i++) {
      const spread = (i - 1.5) * 0.015;
      const finger = part('a-cylinder', {
        radius: 0.006,
        height: 0.05,
        color: skin,
        position: `${spread * sign} -0.028 ${0.004}`,
        rotation: '0 0 0'
      });
      finger.setAttribute('class', 'finger');
      group.appendChild(finger);
    }

    // thumb - also below / angled
    const thumb = part('a-cylinder', {
      radius: 0.0065,
      height: 0.035,
      color: skin,
      position: `${0.028 * sign} -0.008 0.003`,
      rotation: `0 0 ${isLeft ? '42' : '-42'}`
    });
    thumb.setAttribute('class', 'finger');
    group.appendChild(thumb);

    return group;
  }

  function create(config = {}) {
    const {
      skin = '#F5CBA7',
      shirt = '#4A90D9',
      pants = '#2C3E6B',
      hair = '#3D2314',
      hairStyle = 'short',
      scale = 1,
      name = 'Character',
      model = null   // e.g. 'models/person.glb' for better human model
    } = config;

    // Support importing real glTF / GLB human models
    if (model) {
      const modelEntity = document.createElement('a-entity');
      modelEntity.setAttribute('gltf-model', model);
      modelEntity.setAttribute('class', 'mii-character');
      modelEntity.setAttribute('scale', `${scale} ${scale} ${scale}`);

      // Optional floating name tag (can be disabled)
      if (name) {
        const nameTag = document.createElement('a-text');
        nameTag.setAttribute('value', name);
        nameTag.setAttribute('align', 'center');
        nameTag.setAttribute('color', '#ffffff');
        nameTag.setAttribute('width', 1.2);
        nameTag.setAttribute('position', '0 1.1 0');
        nameTag.setAttribute('scale', '0.5 0.5 0.5');
        modelEntity.appendChild(nameTag);
      }

      return modelEntity;
    }

    const root = document.createElement('a-entity');
    root.setAttribute('class', 'mii-character');
    root.setAttribute('scale', `${scale} ${scale} ${scale}`);

    const body = document.createElement('a-entity');
    body.setAttribute('position', '0 0 0');  // standing on ground

    // Full torso (taller, more human proportions)
    const torso = part('a-box', {
      width: 0.28, height: 0.55, depth: 0.18,
      color: shirt, position: '0 0.85 0'
    });
    body.appendChild(torso);

    // Jacket/collar detail
    const jacket = part('a-box', {
      width: 0.30, height: 0.52, depth: 0.19,
      color: '#3a3a3a', position: '0 0.85 0'
    });
    body.appendChild(jacket);

    // Simple tie
    const tie = part('a-box', {
      width: 0.04, height: 0.35, depth: 0.02,
      color: '#1a1a1a', position: '0 0.75 0.1'
    });
    body.appendChild(tie);

    // Arms - single cylinder for simplicity, positioned for full body
    const leftArm = part('a-cylinder', {
      radius: 0.04, height: 0.45, color: shirt,
      position: '-0.20 0.95 0', rotation: '0 0 30'
    });
    leftArm.setAttribute('id', 'left-arm');
    body.appendChild(leftArm);

    const leftHand = createHand(skin, true);
    leftHand.setAttribute('position', '-0.32 0.55 0');
    leftHand.setAttribute('id', 'left-hand');
    body.appendChild(leftHand);

    const rightArm = part('a-cylinder', {
      radius: 0.04, height: 0.45, color: shirt,
      position: '0.20 0.95 0', rotation: '0 0 -30'
    });
    rightArm.setAttribute('id', 'right-arm');
    body.appendChild(rightArm);

    const rightHand = createHand(skin, false);
    rightHand.setAttribute('position', '0.32 0.55 0');
    rightHand.setAttribute('id', 'right-hand');
    body.appendChild(rightHand);

    // Full legs
    const leftUpperLeg = part('a-cylinder', {
      radius: 0.05, height: 0.32, color: pants,
      position: '-0.09 0.42 0'
    });
    body.appendChild(leftUpperLeg);

    const leftLowerLeg = part('a-cylinder', {
      radius: 0.045, height: 0.32, color: pants,
      position: '-0.09 0.12 0'
    });
    body.appendChild(leftLowerLeg);

    const rightUpperLeg = part('a-cylinder', {
      radius: 0.05, height: 0.32, color: pants,
      position: '0.09 0.42 0'
    });
    body.appendChild(rightUpperLeg);

    const rightLowerLeg = part('a-cylinder', {
      radius: 0.045, height: 0.32, color: pants,
      position: '0.09 0.12 0'
    });
    body.appendChild(rightLowerLeg);

    // Shoes
    const leftShoe = part('a-box', {
      width: 0.09, height: 0.06, depth: 0.16,
      color: '#222222', position: '-0.09 0.0 0.04'
    });
    body.appendChild(leftShoe);

    const rightShoe = part('a-box', {
      width: 0.09, height: 0.06, depth: 0.16,
      color: '#222222', position: '0.09 0.0 0.04'
    });
    body.appendChild(rightShoe);

    const headGroup = document.createElement('a-entity');
    headGroup.setAttribute('position', '0 1.28 0');
    headGroup.setAttribute('id', 'head-group');

    const head = part('a-sphere', {
      radius: 0.13, color: skin, position: '0 0.02 0'
    });
    headGroup.appendChild(head);

    // Neck for more human proportions
    const neck = part('a-cylinder', {
      radius: 0.04, height: 0.08, color: skin,
      position: '0 -0.02 0'
    });
    headGroup.appendChild(neck);

    // Ears
    const leftEar = part('a-sphere', {
      radius: 0.025, color: skin,
      position: '-0.13 0.01 0', scale: '0.6 1 0.4'
    });
    headGroup.appendChild(leftEar);
    const rightEar = part('a-sphere', {
      radius: 0.025, color: skin,
      position: '0.13 0.01 0', scale: '0.6 1 0.4'
    });
    headGroup.appendChild(rightEar);

    if (hairStyle === 'short') {
      const hairCap = part('a-sphere', {
        radius: 0.132, color: hair,
        position: '0 0.06 0', scale: '1 0.55 1'
      });
      headGroup.appendChild(hairCap);
    } else if (hairStyle === 'bob') {
      const hairTop = part('a-box', {
        width: 0.24, height: 0.1, depth: 0.22,
        color: hair, position: '0 0.08 0'
      });
      headGroup.appendChild(hairTop);
      const hairSide = part('a-box', {
        width: 0.26, height: 0.14, depth: 0.2,
        color: hair, position: '0 0.02 -0.02', scale: '1 0.7 1'
      });
      headGroup.appendChild(hairSide);
    } else {
      const hairPuff = part('a-sphere', {
        radius: 0.14, color: hair,
        position: '0 0.1 0', scale: '1.1 0.8 1'
      });
      headGroup.appendChild(hairPuff);
    }

    // Eyes with whites for more realism
    const leftEyeWhite = part('a-sphere', {
      radius: 0.022, color: '#ffffff',
      position: '-0.045 0.02 0.115'
    });
    headGroup.appendChild(leftEyeWhite);
    const rightEyeWhite = part('a-sphere', {
      radius: 0.022, color: '#ffffff',
      position: '0.045 0.02 0.115'
    });
    headGroup.appendChild(rightEyeWhite);

    const leftEye = part('a-sphere', {
      radius: 0.012, color: '#1a1a1a',
      position: '-0.045 0.02 0.13'
    });
    leftEye.setAttribute('id', 'left-eye');
    headGroup.appendChild(leftEye);
    const rightEye = part('a-sphere', {
      radius: 0.012, color: '#1a1a1a',
      position: '0.045 0.02 0.13'
    });
    rightEye.setAttribute('id', 'right-eye');
    headGroup.appendChild(rightEye);

    // Eyebrows for expression
    const leftBrow = part('a-box', {
      width: 0.03, height: 0.006, depth: 0.01,
      color: hair, position: '-0.045 0.045 0.12'
    });
    leftBrow.setAttribute('id', 'left-brow');
    headGroup.appendChild(leftBrow);
    const rightBrow = part('a-box', {
      width: 0.03, height: 0.006, depth: 0.01,
      color: hair, position: '0.045 0.045 0.12'
    });
    rightBrow.setAttribute('id', 'right-brow');
    headGroup.appendChild(rightBrow);

    const nose = part('a-sphere', {
      radius: 0.012, color: skin,
      position: '0 -0.02 0.12', scale: '0.8 0.6 1'
    });
    headGroup.appendChild(nose);

    const smile = part('a-torus', {
      radius: 0.03, 'radius-tubular': 0.006,
      arc: 180, color: '#C0392B',
      position: '0 -0.05 0.1', rotation: '180 0 0'
    });
    smile.setAttribute('id', 'mouth');
    headGroup.appendChild(smile);

    body.appendChild(headGroup);

    root.appendChild(body);

    const nameTag = document.createElement('a-text');
    nameTag.setAttribute('value', name);
    nameTag.setAttribute('align', 'center');
    nameTag.setAttribute('color', '#ffffff');
    nameTag.setAttribute('width', 1.2);
    nameTag.setAttribute('position', '0 1.85 0');
    nameTag.setAttribute('scale', '0.5 0.5 0.5');
    root.appendChild(nameTag);

    return root;
  }

  // Subtle blinking for more life (call periodically or on creation)
  function startBlinking(character) {
    const leftEye = character.querySelector('#left-eye');
    const rightEye = character.querySelector('#right-eye');
    if (!leftEye || !rightEye) return;

    const blink = () => {
      leftEye.setAttribute('animation__blink', 'property: scale; from: 1 1 1; to: 1 0.1 1; dur: 120; loop: false;');
      rightEye.setAttribute('animation__blink', 'property: scale; from: 1 1 1; to: 1 0.1 1; dur: 120; loop: false;');

      setTimeout(() => {
        leftEye.setAttribute('scale', '1 1 1');
        rightEye.setAttribute('scale', '1 1 1');
      }, 150);
    };

    // Random blinks every 3-6 seconds
    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 3000;
      setTimeout(() => {
        blink();
        scheduleBlink();
      }, delay);
    };
    scheduleBlink();
  }

  function setSpeaking(character, speaking) {
    // Only works for the procedural primitive model.
    // When using a real glTF model (via `model:` in config), these selectors
    // won't exist. You can still animate the whole model or use
    // the animation-mixer component for baked animations.
    const head = character.querySelector('#head-group');
    const mouth = character.querySelector('#mouth');
    if (!head) return;

    if (speaking) {
      head.setAttribute('animation__talk', 'property: rotation; dir: alternate; dur: 280; loop: true; to: 4 3 0');
      if (mouth) {
        mouth.setAttribute('animation__talk', 'property: scale; dir: alternate; dur: 280; loop: true; to: 1.2 1.7 1');
      }
      // More natural gesturing - right hand more active
      const rightArm = character.querySelector('#right-arm');
      if (rightArm) {
        rightArm.setAttribute('animation__gesture', 'property: rotation; dir: alternate; dur: 480; loop: true; to: 0 0 -45');
      }
      const leftArm = character.querySelector('#left-arm');
      if (leftArm) {
        leftArm.setAttribute('animation__gesture', 'property: rotation; dir: alternate; dur: 720; loop: true; to: 0 0 20');
      }

      // moving fingers + hand lift = more human appendages!
      const hand = character.querySelector('#right-hand');
      if (hand) {
        hand.setAttribute('animation__hand', 'property: position; dir: alternate; dur: 380; loop: true; to: 0.01 0.015 0.012; easing: easeInOutSine');
      }
      const fingers = character.querySelectorAll('.finger');
      fingers.forEach((f, i) => {
        const rotAmt = (i % 2 === 0) ? 22 : -14;
        f.setAttribute('animation__finger', `property: rotation; dir: alternate; dur: 220; loop: true; to: 0 0 ${rotAmt}; delay: ${i * 25}; easing: easeInOutSine`);
      });
    } else {
      head.removeAttribute('animation__talk');
      if (mouth) mouth.removeAttribute('animation__talk');
      const rightArm = character.querySelector('#right-arm');
      if (rightArm) rightArm.removeAttribute('animation__gesture');
      const leftArm = character.querySelector('#left-arm');
      if (leftArm) leftArm.removeAttribute('animation__gesture');

      const hand = character.querySelector('#right-hand');
      if (hand) hand.removeAttribute('animation__hand');

      const fingers = character.querySelectorAll('.finger');
      fingers.forEach(f => {
        f.removeAttribute('animation__finger');
        f.setAttribute('rotation', '0 0 0');
      });
    }
  }

  function setMood(character, mood) {
    // Only works for procedural model (see note in setSpeaking)
    const mouth = character.querySelector('#mouth');
    const leftBrow = character.querySelector('#left-brow');
    const rightBrow = character.querySelector('#right-brow');

    if (!mouth) return;

    if (mood === 'happy') {
      mouth.setAttribute('rotation', '180 0 0');
      mouth.setAttribute('color', '#C0392B');
      if (leftBrow) leftBrow.setAttribute('position', '-0.045 0.048 0.12');
      if (rightBrow) rightBrow.setAttribute('position', '0.045 0.048 0.12');
    } else if (mood === 'neutral') {
      mouth.setAttribute('rotation', '90 0 0');
      mouth.setAttribute('color', '#8b949e');
      if (leftBrow) leftBrow.setAttribute('position', '-0.045 0.045 0.12');
      if (rightBrow) rightBrow.setAttribute('position', '0.045 0.045 0.12');
    } else if (mood === 'concerned') {
      mouth.setAttribute('rotation', '0 0 0');
      mouth.setAttribute('color', '#E06C75');
      if (leftBrow) leftBrow.setAttribute('position', '-0.045 0.042 0.12');
      if (rightBrow) rightBrow.setAttribute('position', '0.045 0.042 0.12');
    }
  }

  return { create, setSpeaking, setMood, startBlinking };
})();