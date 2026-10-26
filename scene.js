'use strict';
(() => {
  const host = document.getElementById('brain-stage');
  if (!host) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const hint = document.getElementById('scene-hint');
  const caption = document.getElementById('scene-caption');
  const motion = document.getElementById('scene-motion');
  const reset = document.getElementById('scene-reset');
  const modes = {
    focus: { color: 0xe7c68b, glow: 0x724a1b, css:'#e7c68b', text:'هر تغییر، از یک انتخاب کوچک آغاز می‌شود.' },
    calm: { color: 0x72d8db, glow: 0x124f67, css:'#72d8db', text:'یک نفس آرام؛ کمی فاصله از شلوغی روز.' },
    growth: { color: 0xa2d4ae, glow: 0x235c41, css:'#a2d4ae', text:'با قدم‌های کوچک و پیوسته، ادامه بده.' }
  };
  let applyMode = () => {};
  document.querySelectorAll('[data-scene-mode]').forEach(button => {
    button.addEventListener('click', () => {
      const mode = modes[button.dataset.sceneMode];
      document.querySelectorAll('[data-scene-mode]').forEach(item => item.setAttribute('aria-pressed',String(item === button)));
      document.querySelector('.neural-visual').style.setProperty('--scene-color',mode.css);
      caption.textContent = mode.text;
      applyMode(mode);
    });
  });
  if (!window.THREE) return;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  } catch (_) {return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  renderer.setClearColor(0x080e15,0);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .9;
  renderer.domElement.setAttribute('aria-hidden','true');
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36,1,.1,50);
  camera.position.set(0,.12,7.6);
  const root = new THREE.Group();
  scene.add(root);
  const sculpture = new THREE.Group();
  root.add(sculpture);
  const key = new THREE.PointLight(0xb0eced,1.8,20);
  key.position.set(-3,3,4); scene.add(key);
  const rim = new THREE.PointLight(0xe7b66a,2.3,20);
  rim.position.set(3,1,-1); scene.add(rim);
  const fill = new THREE.PointLight(0x477cab,1.4,20);
  fill.position.set(0,-3,2); scene.add(fill);
  scene.add(new THREE.AmbientLight(0x82949e,.4));
  const material = new THREE.MeshStandardMaterial({color:0x246975,metalness:.55,roughness:.36,emissive:0x123b42,emissiveIntensity:.12});
  const lineMaterial = new THREE.MeshBasicMaterial({color:0xe7c68b,transparent:true,opacity:.045,wireframe:true});
  const orbitMaterial = new THREE.MeshBasicMaterial({color:0xe7c68b,transparent:true,opacity:.6});
  const rings = new THREE.Group();
  scene.add(rings);
  [1.95,2.25,2.53].forEach((radius,index) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius,index===0?.008:.003,6,160),orbitMaterial);
    ring.rotation.set(Math.PI*.34+index*.18,index*.65,.25+index*.2);
    rings.add(ring);
  });
  const pointPositions = [];
  // Deterministic constellation; no random allocations during animation.
  for(let i=0;i<95;i++) {
    const angle=i*2.39996;
    const radius=2.1+(i%13)*.07;
    const y=((i/94)*2-1)*1.7;
    pointPositions.push(Math.cos(angle)*radius,y,Math.sin(angle)*radius*.7);
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position',new THREE.Float32BufferAttribute(pointPositions,3));
  const particleMaterial = new THREE.PointsMaterial({color:0xe7c68b,size:.026,transparent:true,opacity:.75,depthWrite:false});
  const particles = new THREE.Points(particleGeometry,particleMaterial);
  scene.add(particles);
  const satelliteGeometry = new THREE.IcosahedronGeometry(.07,0);
  const satellites = [0,1,2].map((_,i)=>{const mesh=new THREE.Mesh(satelliteGeometry,orbitMaterial);scene.add(mesh);return mesh;});
  // An elegant sculptural fallback remains if the anatomical asset cannot load.
  const placeholder = new THREE.Mesh(new THREE.TorusKnotGeometry(.92,.29,160,22),material);
  sculpture.add(placeholder);
  const loader = new THREE.GLTFLoader();
  loader.load('assets/cortex.glb', gltf => {
    const model = gltf.scene;
    const bounds = new THREE.Box3().setFromObject(model);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const scale = 3.1 / Math.max(size.x,size.y,size.z);
    model.position.sub(center);
    const container = new THREE.Group();
    container.add(model);container.scale.setScalar(scale);
    const meshes=[];
    model.traverse(object=>{if(object.isMesh)meshes.push(object);});
    meshes.forEach(object=>{
      if(object.material.map && !material.bumpMap){material.bumpMap=object.material.map;material.bumpScale=.075;material.needsUpdate=true;}
      object.material=material;
      const wire = new THREE.Mesh(object.geometry,lineMaterial);
      object.add(wire);
    });
    sculpture.remove(placeholder);placeholder.geometry.dispose();
    sculpture.add(container);
    host.dataset.modelLoaded='true';
    draw();
  },undefined,()=>{host.dataset.modelLoaded='fallback';});
  host.classList.add('is-ready');
  host.setAttribute('aria-label','مدل سه‌بعدی تعاملی مغز؛ با کشیدن افقی یا کلیدهای جهت آن را بچرخانید.');
  document.querySelector('.scene-modes').hidden=false;
  hint.textContent='بکش و بچرخان';
  motion.hidden=false;reset.hidden=false;
  let angleX=.12, angleY=.55, dragging=false, previousX=0,previousY=0;
  let pointerId=null,paused=reduced.matches,inView=true,frame=0,last=0,elapsed=0;
  function draw() {
    root.rotation.set(angleX,angleY,0);
    renderer.render(scene,camera);
  }
  function shouldAnimate(){return !paused && !dragging && inView && !document.hidden;}
  function schedule(){if(shouldAnimate() && !frame) frame=requestAnimationFrame(animate);}
  function stop(){if(frame)cancelAnimationFrame(frame);frame=0;last=0;}
  function animate(time){
    frame=0;
    if(!shouldAnimate())return;
    const delta=last?Math.min((time-last)/1000,.05):0;last=time;elapsed+=delta;
    angleY+=delta*.085;
    sculpture.position.y=Math.sin(elapsed*.6)*.045;
    particles.rotation.y=elapsed*.025;
    satellites.forEach((mesh,i)=>{const phase=elapsed*.17+i*2.094;mesh.position.set(Math.cos(phase)*2.25,Math.sin(phase*1.3)*.7,Math.sin(phase)*1.2);});
    draw();schedule();
  }
  function updateMotion(){
    motion.textContent=paused?'▷':'Ⅱ';
    motion.setAttribute('aria-label',paused?'شروع چرخش خودکار':'توقف چرخش خودکار');
    motion.setAttribute('aria-pressed',String(paused));
    if(paused)stop();else schedule();
  }
  motion.addEventListener('click',()=>{paused=!paused;updateMotion();});
  reset.addEventListener('click',()=>{angleX=.12;angleY=.55;draw();});
  host.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;
    dragging=true;pointerId=event.pointerId;previousX=event.clientX;previousY=event.clientY;
    host.setPointerCapture(pointerId);host.classList.add('is-dragging');stop();
  });
  host.addEventListener('pointermove',event=>{
    if(!dragging||event.pointerId!==pointerId)return;
    angleY+=(event.clientX-previousX)*.009;
    angleX=Math.max(-.65,Math.min(.65,angleX+(event.clientY-previousY)*.004));
    previousX=event.clientX;previousY=event.clientY;draw();
  });
  function endDrag(){dragging=false;pointerId=null;host.classList.remove('is-dragging');schedule();}
  host.addEventListener('pointerup',endDrag);host.addEventListener('pointercancel',endDrag);host.addEventListener('lostpointercapture',endDrag);
  host.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(event.key))return;
    event.preventDefault();paused=true;updateMotion();
    if(event.key==='ArrowLeft')angleY-=.15;if(event.key==='ArrowRight')angleY+=.15;
    if(event.key==='ArrowUp')angleX=Math.max(-.65,angleX-.1);if(event.key==='ArrowDown')angleX=Math.min(.65,angleX+.1);
    if(event.key==='Home'){angleX=.12;angleY=.55;}draw();
  });
  applyMode=mode=>{
    orbitMaterial.color.setHex(mode.color);particleMaterial.color.setHex(mode.color);lineMaterial.color.setHex(mode.color);
    material.emissive.setHex(mode.glow);rim.color.setHex(mode.color);draw();
  };
  new ResizeObserver(()=>{
    const {width,height}=host.getBoundingClientRect();
    if(!width||!height)return;
    renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();draw();
  }).observe(host);
  new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;if(inView){draw();schedule();}else stop();},{threshold:.05}).observe(host);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else schedule();});
  reduced.addEventListener('change',event=>{if(event.matches){paused=true;updateMotion();}});
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();paused=true;stop();host.classList.remove('is-ready');hint.textContent='فضای شخصیِ یک شروع تازه';motion.hidden=true;reset.hidden=true;document.querySelector('.scene-modes').hidden=true;});
  updateMotion();draw();
})();
