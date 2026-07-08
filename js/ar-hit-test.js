AFRAME.registerComponent('ar-placement', {
  schema: {
    target: { type: 'selector' },
    reticle: { type: 'selector' }
  },

  init() {
    this.xrHitTestSource = null;
    this.viewerSpace = null;
    this.refSpace = null;
    this.hasSurface = false;
    this.placed = false;
    this.lastPose = null;

    this.onEnterAR = this.onEnterAR.bind(this);
    this.onSelect = this.onSelect.bind(this);

    this.el.sceneEl.addEventListener('enter-vr', this.onEnterAR);
    this.el.sceneEl.addEventListener('enter-ar', this.onEnterAR);
  },

  async onEnterAR() {
    const session = this.el.sceneEl.renderer.xr.getSession();
    if (!session || session.mode !== 'immersive-ar') return;

    this.placed = false;
    this.hasSurface = false;
    this.lastPose = null;

    const sky = this.el.sceneEl.querySelector('a-sky');
    if (sky) sky.setAttribute('visible', 'false');

    try {
      this.viewerSpace = await session.requestReferenceSpace('viewer');
      this.refSpace = await session.requestReferenceSpace('local');

      if (session.requestHitTestSource) {
        this.xrHitTestSource = await session.requestHitTestSource({
          space: this.viewerSpace,
          entityTypes: ['plane']
        });
      }
    } catch (e) {
      console.warn('AR hit-test unavailable:', e);
    }

    session.addEventListener('select', this.onSelect);
    session.addEventListener('end', () => {
      this.xrHitTestSource = null;
      this.hasSurface = false;
      session.removeEventListener('select', this.onSelect);
      if (sky) sky.setAttribute('visible', 'true');
    });

    this.el.sceneEl.emit('ar-ready');
  },

  onSelect(evt) {
    if (this.placed || !this.hasSurface) return;
    this.confirmPlace();
  },

  confirmPlace(force = false) {
    if (this.placed || !this.data.target) return false;
    if (!force && !this.hasSurface) return false;

    this.placed = true;
    this.hideReticle();

    const target = this.data.target;
    if (this.lastPose) {
      const p = this.lastPose.position;
      const q = this.lastPose.quaternion;
      target.object3D.position.copy(p);
      target.object3D.quaternion.copy(q);
    }

    this.el.sceneEl.emit('ar-placed', { target });
    return true;
  },

  hideReticle() {
    if (this.data.reticle) {
      this.data.reticle.setAttribute('visible', 'false');
    }
  },

  showReticle() {
    if (this.data.reticle && !this.placed) {
      this.data.reticle.setAttribute('visible', 'true');
    }
  },

  tick() {
    if (this.placed) return;

    const frame = this.el.sceneEl.frame;
    const session = this.el.sceneEl.renderer?.xr?.getSession();
    if (!frame || !session || session.mode !== 'immersive-ar') return;
    if (!this.xrHitTestSource || !this.data.target) return;

    const hits = frame.getHitTestResults(this.xrHitTestSource);
    if (hits.length === 0) {
      this.hasSurface = false;
      return;
    }

    const pose = hits[0].getPose(this.refSpace);
    if (!pose) return;

    const t = this.data.target.object3D;
    t.position.set(
      pose.transform.position.x,
      pose.transform.position.y,
      pose.transform.position.z
    );
    t.quaternion.set(
      pose.transform.orientation.x,
      pose.transform.orientation.y,
      pose.transform.orientation.z,
      pose.transform.orientation.w
    );

    if (!this.lastPose) {
      const T = window.THREE || (typeof AFRAME !== 'undefined' && AFRAME.THREE);
      if (!T) {
        console.warn('THREE not available yet for AR hit-test pose tracking');
        return;
      }
      this.lastPose = {
        position: new T.Vector3(),
        quaternion: new T.Quaternion()
      };
    }
    this.lastPose.position.copy(t.position);
    this.lastPose.quaternion.copy(t.quaternion);

    if (this.data.reticle) {
      this.data.reticle.object3D.position.copy(t.position);
      this.data.reticle.object3D.quaternion.copy(t.quaternion);
    }

    if (!this.hasSurface) {
      this.hasSurface = true;
      this.showReticle();
      this.el.sceneEl.emit('surface-found');
    }
  }
});