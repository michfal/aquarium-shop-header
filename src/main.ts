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

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: '#1099bb', resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById('pixi-container')!.appendChild(app.canvas);

  // Load the bunny texture
  const texture = await Assets.load('https://i.imgur.com/BFZqXAH.jpg');

  // Create a bunny Sprite
  const background = new Sprite(texture);

  // Center the sprite's anchor point
  background.anchor.set(0.5);

  // Move the sprite to the center of the screen
  background.position.set(app.screen.width / 2, app.screen.height / 2);

  // Add the background to the stage
  //app.stage.addChild(background);

  const container = new Container();
  container.addChild(background);

  const headerStyle = new TextStyle({
    fontFamily: ['Helvetica', 'Arial', 'sans-serif'],
    fontSize: 56,
    fill: 'ffffff',
    dropShadow: {
      color: '#000000',
      blur: 3,
      distance: 2,
      angle: Math.PI / 2,
    },
    align: 'center',
  });

  const header = new Text({
    text: 'AQUA-SHOP',
    style: headerStyle,
    anchor: 0.5,
  });

  header.position.set(app.screen.width / 2, app.screen.height / 2);
  container.addChild(header);

  window.addEventListener('resize', () => {
    header.position.set(app.screen.width / 2, app.screen.height / 2);
    background.position.set(app.screen.width / 2, app.screen.height / 2);
  });

  // Load and configure displacement sprite
  const displacementTexture = await Assets.load('https://i.imgur.com/hVKo63B.jpg');
  const displacementSprite = new Sprite(displacementTexture);
  displacementSprite.texture.source.addressMode = 'repeat'; // Pixi v8: use string
  displacementSprite.visible = false; // Still used for filter, no need to show
  app.stage.addChild(displacementSprite); // Must be added to stage!

  // Create and apply displacement filter
  const displacementFilter = new DisplacementFilter({
    sprite: displacementSprite,
    scale: { x: 20, y: 20 },
  });

  const shockwaveFilter = new ShockwaveFilter({
    //center: { x: app.screen.width / 2, y: app.screen.height / 2 },
    center: {
      x: Math.random() * app.screen.width,
      y: Math.random() * app.screen.height
    },
    speed: 200.0,
    amplitude: 40.0,
    wavelength: 50.0,
    brightness: 1.0,
    radius: 380,
    time: 0,
  });

  container.filters = [displacementFilter, shockwaveFilter];

  console.log(shockwaveFilter.time);
  shockwaveFilter.time = 0;
  // Add container to stage
  app.stage.addChild(container);

  // Animate the displacement sprite to see the effect
  app.ticker.add((ticker: Ticker) => {
    displacementSprite.x += 1;
    // displacementSprite.y += 1;
    if (displacementSprite.x > displacementSprite.width) {
      displacementSprite.x = 0;
    }

    shockwaveFilter.time += ticker.deltaTime * 0.05;
    if (shockwaveFilter.time > 4.7) {
      shockwaveFilter.time = 0;
      shockwaveFilter.center = {
        x: Math.random() * app.screen.width,
        y: Math.random() * app.screen.height,
      };
    }
  });
})();
