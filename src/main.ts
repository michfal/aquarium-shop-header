import {
  Application,
  Assets,
  Sprite,
  Container,
  Text,
  TextStyle,
  Ticker,
  DisplacementFilter,
} from "pixi.js";

import { ShockwaveFilter } from "pixi-filters";

// Config
const BACKGROUND_URL = 'https://i.imgur.com/BFZqXAH.jpg';
const DISPLACEMENT_URL = 'https://i.imgur.com/hVKo63B.jpg';

// Application bootstrap
async function initApp(): Promise<Application> {
  const app = new Application();
  await app.init({ background: '#1099bb', resizeTo: window });
  document.getElementById('pixi-container')!.appendChild(app.canvas);
  return app;
}

// Load main background and return sprite
async function createBackground(app: Application): Promise<Sprite> {
  const texture = await Assets.load(BACKGROUND_URL);
  const sprite = new Sprite(texture);
  sprite.anchor.set(0.5);
  sprite.position.set(app.screen.width / 2, app.screen.height / 2);
  return sprite;
}

// Create centered header text
function createHeader(app: Application): Text {
  const style = new TextStyle({
    fontFamily: ['Helvetica', 'Arial', 'sans-serif'],
    fontSize: 56,
    fill: 'ffffff',
    dropShadow: { color: '#000000', blur: 3, distance: 2 },
    align: 'center',
  });

  const text = new Text({
    text: 'AQUA-SHOP',
    style,
    anchor: 0.5,
  });

  text.position.set(app.screen.width / 2, app.screen.height / 2);
  return text;
}

// Load displacement sprite and return filter + sprite
async function setupDisplacement(app: Application): Promise<{
  filter: DisplacementFilter;
  sprite: Sprite;
}> {
  const texture = await Assets.load(DISPLACEMENT_URL);
  const sprite = new Sprite(texture);
  sprite.texture.source.addressMode = 'repeat';
  sprite.visible = false;
  app.stage.addChild(sprite);

  const filter = new DisplacementFilter({
    sprite,
    scale: { x: 20, y: 20 },
  });

  return { filter, sprite };
}

// Create shockwave filter
function createShockwave(app: Application, config: ShockwaveConfig = {}): ShockwaveFilter {
  const {
    speed = 200.0,
    amplitude = 40.0,
    wavelength = 50.0,
    brightness = 1.0,
    radius = 380,
    time = 100,
  } = config;

  return new ShockwaveFilter({
    center: { x: 0, y: 0 },
    speed: speed,
    amplitude: amplitude,
    wavelength: wavelength,
    brightness: brightness,
    radius: radius,
    time: time,
  });
}

// Main app logic
async function main() {
  const app = await initApp();

  const container = new Container();
  app.stage.addChild(container);

  const background = await createBackground(app);
  const header = createHeader(app);
  container.addChild(background, header);

  const { filter: displacementFilter, sprite: displacementSprite } = await setupDisplacement(app);
  const shockwaveFilter = createShockwave(app);
  const shockwaveFilter2 = createShockwave(app, {
    speed: 120,
    amplitude: 15,
    wavelength: 40,
    brightness: 1,
    radius: 200,
    time: 100,
});
  container.filters = [displacementFilter, shockwaveFilter, shockwaveFilter2];

  // Responsive layout
  window.addEventListener('resize', () => {
    const centerX = app.screen.width / 2;
    const centerY = app.screen.height / 2;
    background.position.set(centerX, centerY);
    header.position.set(centerX, centerY);
  });

  // Animate filters
  app.ticker.add((ticker: Ticker) => {
    displacementSprite.x += 1;
    if (displacementSprite.x > displacementSprite.width) {
      displacementSprite.x = 0;
    }

    if (shockwaveFilter.time < 4.7) {
      shockwaveFilter.time += ticker.deltaTime * 0.05;
    }

    if (shockwaveFilter2.time < 4.7) {
      shockwaveFilter2.time += ticker.deltaTime * 0.05;
    }
  });

  // Trigger shockwave on click
  window.addEventListener('click', (e) => {
    const x = e.pageX;
    const y = e.pageY;

    shockwaveFilter.center.x = x;
    shockwaveFilter.center.y = y;
    shockwaveFilter.time = 0;
  });

  let lastFire = 0;
  const minDelay = 1000; // ms

  window.addEventListener('mousemove', (e) => {
    const now = performance.now();
    const chance = 0.2;

    if (Math.random() < chance && now - lastFire > minDelay) {
      lastFire = now;

      const x = e.pageX;
      const y = e.pageY;

      shockwaveFilter2.center.x = x;
      shockwaveFilter2.center.y = y;
      shockwaveFilter2.time = 0;
    }
  });
}

main().catch(console.error);