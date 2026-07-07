AFRAME.registerComponent('ar-hit-test', {
  schema: {
    target: { type: 'selector' }
  },

  init() {
    this.xrHitTestSource = null;
    this.viewerSpace = null;
    this.refSpace = null;

    this.el.sceneEl.addEventListener('enter-vr', async () => {
      const session = this.el.sceneEl.renderer.xr.getSession();
      if (!session || session.mode !== 'immersive-ar') return;

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

      session.addEventListener('end', () => {
        this.xrHitTestSource = null;
      });
    });
  },

  tick() {
    const frame = this.el.sceneEl.frame;
    const session = this.el.sceneEl.renderer?.xr?.getSession();
    if (!frame || !session || session.mode !== 'immersive-ar') return;
    if (!this.xrHitTestSource || !this.data.target) return;

    const hits = frame.getHitTestResults(this.xrHitTestSource);
    if (hits.length === 0) return;

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
  }
});