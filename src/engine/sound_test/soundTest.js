console.log('OK :)');

// for legacy browsers
const AudioContext = window.AudioContext || window.webkitAudioContext;

const audioContext2 = new AudioContext();
const struct = {

};

const addAudioToStruct = (src) => {
  const audio = new Audio(src);
  audio.onended = () => {
    for (const instance of struct[src].instances) {
      if (instance.audio === audio) {
        console.log('found');
        instance.playing = false;
        // TODO instead of playing : status = PLAYING | ENDED | PAUSED
      }
    }
  };
  const track = audioContext2.createMediaElementSource(audio);
  track.connect(audioContext2.destination);

  const instance = {
    playing: false,
    audio: audio,
  };

  struct[src].instances.push(instance);
  return instance;
};

export const load = (src) => {
  if (src in struct) {
    return struct[src];
  }

  struct[src] = {
    instances: [],
  };

  const instance = addAudioToStruct(src);

  return struct[src];
};

export const play = (src) => {
  if (audioContext2.state === 'suspended') {
    console.log('resume');
    audioContext2.resume();
  }

  for (const instance of struct[src].instances) {
    if (instance.playing === false) {
      instance.playing = true;
      instance.audio.play();
      return;
    }
  }

  const instance = addAudioToStruct(src);
  instance.playing = true;
  instance.audio.play();
};

// const file = "res/computerNoise_000.ogg";
/*const file = "res/lowFrequency_explosion_000.ogg";

load(file);

document.getElementById('toto').onclick = () => {
  console.log('clicked');
  play(file);
  console.log(struct[file].instances.reduce((previousValue, currentValue) => {
    return previousValue + (currentValue.playing ? 1 : 0)
  }, 0), struct[file].instances.length);
};*/
