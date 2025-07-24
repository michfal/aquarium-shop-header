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
function createShockwave(app: Application): ShockwaveFilter {
  return new ShockwaveFilter({
    center: { x: 0, y: 0 },
    speed: 200.0,
    amplitude: 40.0,
    wavelength: 50.0,
    brightness: 1.0,
    radius: 380,
    time: 100, // Start inactive
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
  container.filters = [displacementFilter, shockwaveFilter];

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
  });

  // Trigger shockwave on click
  window.addEventListener('click', (e) => {
    //const rect = app.view.getBoundingClientRect();
    // const x = e.clientX - rect.left;
    // const y = e.clientY - rect.top;
    const x = e.pageX;
    const y = e.pageY;

    shockwaveFilter.center.x = x;
    shockwaveFilter.center.y = y;
    shockwaveFilter.time = 0;
  });
}

main().catch(console.error)

// (async () => {
//   // Create a new application
//   const app = new Application();

//   // Initialize the application
//   await app.init({ background: '#1099bb', resizeTo: window });

//   // Append the application canvas to the document body
//   document.getElementById('pixi-container')!.appendChild(app.canvas);

//   // Load the bunny texture
//   const texture = await Assets.load('https://i.imgur.com/BFZqXAH.jpg');

//   // Create a bunny Sprite
//   const background = new Sprite(texture);

//   // Center the sprite's anchor point
//   background.anchor.set(0.5);

//   // Move the sprite to the center of the screen
//   background.position.set(app.screen.width / 2, app.screen.height / 2);

//   // Add the background to the stage
//   //app.stage.addChild(background);

//   const container = new Container();
//   container.addChild(background);

//   const headerStyle = new TextStyle({
//     fontFamily: ['Helvetica', 'Arial', 'sans-serif'],
//     fontSize: 56,
//     fill: 'ffffff',
//     dropShadow: {
//       color: '#000000',
//       blur: 3,
//       distance: 2,
//       angle: Math.PI / 2,
//     },
//     align: 'center',
//   });

//   const header = new Text({
//     text: 'AQUA-SHOP',
//     style: headerStyle,
//     anchor: 0.5,
//   });

//   header.position.set(app.screen.width / 2, app.screen.height / 2);
//   container.addChild(header);

//   window.addEventListener('resize', () => {
//     header.position.set(app.screen.width / 2, app.screen.height / 2);
//     background.position.set(app.screen.width / 2, app.screen.height / 2);
//   });

//   // Load and configure displacement sprite
//   const displacementTexture = await Assets.load('https://i.imgur.com/hVKo63B.jpg');
//   const displacementSprite = new Sprite(displacementTexture);
//   displacementSprite.texture.source.addressMode = 'repeat'; // Pixi v8: use string
//   displacementSprite.visible = false; // Still used for filter, no need to show
//   app.stage.addChild(displacementSprite); // Must be added to stage!

//   // Create and apply displacement filter
//   const displacementFilter = new DisplacementFilter({
//     sprite: displacementSprite,
//     scale: { x: 20, y: 20 },
//   });

//   const shockwaveFilter = new ShockwaveFilter({
//     center: {
//       x: Math.random() * app.screen.width,
//       y: Math.random() * app.screen.height,
//     },
//     speed: 200.0,
//     amplitude: 40.0,
//     wavelength: 50.0,
//     brightness: 1.0,
//     radius: 380,
//     time: 0,
//   });

//   container.filters = [displacementFilter, shockwaveFilter];

//   // console.log(shockwaveFilter.time);
//   shockwaveFilter.time = 100;
//   // Add container to stage
//   app.stage.addChild(container);

//   // Animate the displacement sprite to see the effect
//   app.ticker.add((ticker: Ticker) => {
//     displacementSprite.x += 1;
//     // displacementSprite.y += 1;
//     if (displacementSprite.x > displacementSprite.width) {
//       displacementSprite.x = 0;
//     }

//     // Let shockwave animate over time only if active
//     if (shockwaveFilter.time < 4.7) {
//       shockwaveFilter.time += ticker.deltaTime * 0.05;
//     }
//   });

//   window.addEventListener('click', (e) => {
//     const x = e.pageX;
//     const y = e.pageY;

//     shockwaveFilter.center.x = x;
//     shockwaveFilter.center.y = y;
//     shockwaveFilter.time = 0;
//   });
// })();
