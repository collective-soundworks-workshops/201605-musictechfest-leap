// enable source-maps in node
import 'source-map-support/register';
// import soundworks (server-side) and experience
import * as soundworks from 'soundworks/server';
import SoundfieldExperience from './SoundfieldExperience';
// import leap service
import '../common/service/Leap';

class ConductorExperience extends soundworks.Experience {
  constructor() {
    super('conductor');

    this.sharedParams = this.require('shared-params');
    // this.sharedParams.addText('numPlayers', 'num players', 0, ['conductor']);
    this.sharedParams.addEnum('record', 'record', ['start', 'stop'], 'stop');
    this.sharedParams.addTrigger('endPerformance', 'endPerformance', 'player');

    this.sharedParams.addNumber('periodAbs', 'periodAbs', 1, 10, 0.01, 10, 'soloist');

    // params for granular engine
    this.sharedParams.addNumber('periodAbs', 'periodAbs', 0.02, 0.2, 0.001, 0.05, 'player');
    this.sharedParams.addNumber('durationAbs', 'durationAbs', 0.01, 0.5, 0.001, 0.2, 'player');
    this.sharedParams.addNumber('positionVar', 'positionVar', 0.01, 0.5, 0.001, 0.2, 'player');
    this.sharedParams.addNumber('gainMult', 'gainMult', 1, 100, 0.1, 20, 'player');
  }
}

// sets the size of the area, orther setup informations are not needed
const setup = {
  area: {
    height: 8,
    width: 6,
    background: '/img/saal1_floorplan.svg',
  },
  radius: 1,
}

const midiController = 'LPD8';
const bpm = 60;
const recordPeriod = 60 / bpm;
const recordDuration = 2 * recordPeriod;
const baseNote = 44;
const steps = 8;
const resamplingVarMax = 1200;

// initialize the server with configuration informations
soundworks.server.init({
  setup,
  appName: 'Grain',
  midiController,
  recordPeriod,
  recordDuration,
  baseNote,
  steps,
  resamplingVarMax,
  bpm,
});

// define the configuration object to be passed to the `.ejs` template
soundworks.server.setClientConfigDefinition((clientType, config, httpRequest) => {
  return {
    clientType: clientType,
    socketIO: config.socketIO,
    appName: config.appName,
    version: config.version,
    defaultType: config.defaultClient,
    assetsDomain: config.assetsDomain,
  };
});

// create the common server experience for both the soloists and the players
const conductor = new ConductorExperience();
const soundfieldExperience = new SoundfieldExperience(['player', 'soloist']);

// start the application
soundworks.server.start();
