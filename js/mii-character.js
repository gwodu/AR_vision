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
      name = 'Character'
    } = config;

    const root = document.createElement('a-entity');
    root.setAttribute('class', 'mii-character');
    root.setAttribute('scale', `${scale} ${scale} ${scale}`);

    const body = document.createElement('a-entity');
    body.setAttribute('position', '0 0.55 0');

    const torso = part('a-box', {
      width: 0.22, height: 0.26, depth: 0.14,
      color: shirt, position: '0 0.13 0'
    });
    body.appendChild(torso);

    const leftArm = part('a-cylinder', {
      radius: 0.035, height: 0.2, color: shirt,
      position: '-0.16 0.18 0', rotation: '0 0 15'
    });
    leftArm.setAttribute('id', 'left-arm');
    body.appendChild(leftArm);

    const rightArm = part('a-cylinder', {
      radius: 0.035, height: 0.2, color: shirt,
      position: '0.16 0.18 0', rotation: '0 0 -15'
    });
    rightArm.setAttribute('id', 'right-arm');
    body.appendChild(rightArm);

    const leftHand = createHand(skin, true);
    leftHand.setAttribute('position', '-0.195 0.06 0');
    leftHand.setAttribute('id', 'left-hand');
    // subtle idle movement on hands (appendages)
    leftHand.setAttribute('animation__sway', 'property: rotation; dir: alternate; dur: 2100; loop: true; to: 0 0 6; easing: easeInOutSine');
    body.appendChild(leftHand);

    const rightHand = createHand(skin, false);
    rightHand.setAttribute('position', '0.195 0.06 0');
    rightHand.setAttribute('id', 'right-hand');
    rightHand.setAttribute('animation__sway', 'property: rotation; dir: alternate; dur: 2400; loop: true; to: 0 0 -7; easing: easeInOutSine');
    body.appendChild(rightHand);

    const headGroup = document.createElement('a-entity');
    headGroup.setAttribute('position', '0 0.38 0');
    headGroup.setAttribute('id', 'head-group');

    const head = part('a-sphere', {
      radius: 0.13, color: skin, position: '0 0.02 0'
    });
    headGroup.appendChild(head);

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

    const leftEye = part('a-sphere', {
      radius: 0.018, color: '#1a1a1a',
      position: '-0.045 0.02 0.11'
    });
    const rightEye = part('a-sphere', {
      radius: 0.018, color: '#1a1a1a',
      position: '0.045 0.02 0.11'
    });
    headGroup.appendChild(leftEye);
    headGroup.appendChild(rightEye);

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

    const leftLeg = part('a-cylinder', {
      radius: 0.045, height: 0.22, color: pants,
      position: '-0.07 -0.12 0'
    });
    body.appendChild(leftLeg);

    const rightLeg = part('a-cylinder', {
      radius: 0.045, height: 0.22, color: pants,
      position: '0.07 -0.12 0'
    });
    body.appendChild(rightLeg);

    const leftShoe = part('a-box', {
      width: 0.08, height: 0.04, depth: 0.12,
      color: '#FFFFFF', position: '-0.07 -0.25 0.02'
    });
    const rightShoe = part('a-box', {
      width: 0.08, height: 0.04, depth: 0.12,
      color: '#FFFFFF', position: '0.07 -0.25 0.02'
    });
    body.appendChild(leftShoe);
    body.appendChild(rightShoe);

    root.appendChild(body);

    root.setAttribute('animation__idle', 'property: position; dir: alternate; dur: 1800; loop: true; to: 0 0.02 0; easing: easeInOutSine');

    const nameTag = document.createElement('a-text');
    nameTag.setAttribute('value', name);
    nameTag.setAttribute('align', 'center');
    nameTag.setAttribute('color', '#ffffff');
    nameTag.setAttribute('width', 1.2);
    nameTag.setAttribute('position', '0 0.95 0');
    nameTag.setAttribute('scale', '0.5 0.5 0.5');
    root.appendChild(nameTag);

    return root;
  }

  function setSpeaking(character, speaking) {
    const head = character.querySelector('#head-group');
    const mouth = character.querySelector('#mouth');
    if (!head) return;

    if (speaking) {
      head.setAttribute('animation__talk', 'property: rotation; dir: alternate; dur: 350; loop: true; to: 5 0 0');
      if (mouth) {
        mouth.setAttribute('animation__talk', 'property: scale; dir: alternate; dur: 350; loop: true; to: 1.3 1.8 1');
      }
      const rightArm = character.querySelector('#right-arm');
      if (rightArm) {
        rightArm.setAttribute('animation__gesture', 'property: rotation; dir: alternate; dur: 550; loop: true; to: 0 0 -32');
      }
      const leftArm = character.querySelector('#left-arm');
      if (leftArm) {
        leftArm.setAttribute('animation__gesture', 'property: rotation; dir: alternate; dur: 850; loop: true; to: 0 0 14');
      }

      // moving fingers + hand lift = more human appendages!
      const hand = character.querySelector('#right-hand');
      if (hand) {
        hand.setAttribute('animation__hand', 'property: position; dir: alternate; dur: 420; loop: true; to: 0.008 0.012 0.015; easing: easeInOutSine');
      }
      const fingers = character.querySelectorAll('.finger');
      fingers.forEach((f, i) => {
        const rotAmt = (i % 2 === 0) ? 16 : -16;
        f.setAttribute('animation__finger', `property: rotation; dir: alternate; dur: 240; loop: true; to: 0 0 ${rotAmt}; delay: ${i * 30}; easing: easeInOutSine`);
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
    const mouth = character.querySelector('#mouth');
    if (!mouth) return;
    if (mood === 'happy') {
      mouth.setAttribute('rotation', '180 0 0');
      mouth.setAttribute('color', '#C0392B');
    } else if (mood === 'neutral') {
      mouth.setAttribute('rotation', '90 0 0');
      mouth.setAttribute('color', '#8b949e');
    } else if (mood === 'concerned') {
      mouth.setAttribute('rotation', '0 0 0');
      mouth.setAttribute('color', '#E06C75');
    }
  }

  return { create, setSpeaking, setMood };
})();