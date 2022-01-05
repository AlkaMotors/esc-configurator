import Source from '../Source';
import eeprom from './eeprom';
import settings from './settings';
import escs from './escs.json';
import versions from './versions.json';

class AM32Source extends Source {
  buildDisplayName(flash, make) {
    const settings = flash.settings;
    let revision = 'Unsupported/Unrecognized';
    if(settings.MAIN_REVISION !== undefined && settings.SUB_REVISION !== undefined) {
      revision = `${settings.MAIN_REVISION}.${settings.SUB_REVISION}`;
    }

    if(make === 'NOT READY') {
      revision = 'FLASH FIRMWARE';
    }

    const bootloader = flash.bootloader.valid ? `, Bootloader v${flash.bootloader.version} (${flash.bootloader.pin})` : ', Bootloader unknown';

    return `${make} - ${this.name}, ${revision}${bootloader}`;
  }

  async getVersions() {
    this.setLocalVersions(versions.Arm);
    return versions.Arm;
  }
}

const source = new AM32Source(
  'AM32',
  {
    ...eeprom,
    ...settings,
  },
  escs
);

export default source;
