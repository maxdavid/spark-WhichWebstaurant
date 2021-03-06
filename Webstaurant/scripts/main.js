const Scene = require('Scene');
const CameraInfo = require('CameraInfo');
const Animation = require('Animation');
const Time = require('Time');
const Reactive = require('Reactive');
const Audio = require('Audio');
// export const Diagnostics = require('Diagnostics');

// Import catalog
import { catalog } from './catalog.js';
import { shuffle } from './util.js';

(async function () {
  const shuffledCatalog = await shuffle(catalog);

  const [textContainer, titleCard, playbackController] = await Promise.all([
    Scene.root.findFirst('text-container'),
    Scene.root.findFirst('title-card'),
    Audio.getAudioPlaybackController('audioPlaybackController0'),
  ]);

  // text-container is visible, but still size (0,0)
  textContainer.hidden = false;
  titleCard.hidden = false;

  // EventSource to trigger when user starts recording
  const recordingEvent = CameraInfo.isRecordingVideo.onOn();

  recordingEvent.subscribe(() => {
    const randomRunner = () => {
      // This function is the meat of the program
      titleCard.hidden = true;
      let playing = Reactive.val(true);
      let lastRandom = 0;

      const shuffleRunner = () => {
        // Starts ticking sound
        playbackController.setLooping(playing.pinLastValue());
        playbackController.setPlaying(playing.pinLastValue());

        const shuffleImages = () => {
          // Shuffles through the images
          shuffledCatalog[lastRandom].plane.hidden = true;
          lastRandom = lastRandom + 1;
          if (lastRandom >= shuffledCatalog.length - 1) lastRandom = 0;
          shuffledCatalog[lastRandom].plane.hidden = false;
        };

        // Swaps image every 80ms, stops after 5s
        const randomItems = Time.setInterval(shuffleImages, 80);
        Time.setTimeout(() => Time.clearInterval(randomItems), 5000);
      };

      const showInfo = () => {
        // Stops ticking sound
        playing = Reactive.val(false);
        playbackController.setPlaying(playing.pinLastValue());

        // Expands text information
        const timeDriverParameters = {
          durationMilliseconds: 500,
          loopCount: 1,
          mirror: false,
        };
        const timeDriver = Animation.timeDriver(timeDriverParameters);
        const sampler = Animation.samplers.linear(0, 0.6);
        const translationAnimation = Animation.animate(timeDriver, sampler);
        const xScale = Reactive.val(4);
        shuffledCatalog[lastRandom].text.hidden = false;
        textContainer.transform.scaleY = translationAnimation;
        textContainer.transform.scaleX = translationAnimation.mul(xScale);
        timeDriver.start();
      };

      shuffleRunner();
      Time.setTimeout(showInfo, 5000);
    };

    // 1 second after recording starts, trigger the program
    Time.setTimeout(randomRunner, 2000);
  });
})();
