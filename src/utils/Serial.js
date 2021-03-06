import Msp from './Msp';
import FourWay from './FourWay';

import {
  QueueProcessor,
} from './helpers/QueueProcessor';

/**
 * Abstraction layer for all serial communication
 */
class Serial {
  constructor(port) {
    this.port = port;
    this.msp = null;
    this.fourWay = null;
    this.writer = null;
    this.reader = null;

    this.write = this.write.bind(this);
    this.executeCommand = this.executeCommand.bind(this);

    this.logCallback = null;
    this.packetErrorsCallback = null;

    this.qp = new QueueProcessor();
  }

  /**
   * Send a buffer via serial and process response with the response handler
   */
  async executeCommand(buffer, responseHandler) {
    await this.write(buffer);
    if(responseHandler) {
      return this.qp.addCommand(responseHandler);
    }
  }

  setLogCallback(logCallback) {
    this.logCallback = logCallback;

    this.fourWay.setLogCallback(logCallback);
    this.msp.setLogCallback(logCallback);
  }

  setPacketErrorsCallback(packetErrorsCallback) {
    this.packetErrorsCallback = packetErrorsCallback;

    this.fourWay.setPacketErrorsCallback(packetErrorsCallback);
    this.msp.setPacketErrorsCallback(packetErrorsCallback);
  }

  async getApiVersion() {
    return this.msp.getApiVersion();
  }

  async getFcVariant() {
    return this.msp.getFcVariant();
  }

  async getFcVersion() {
    return this.msp.getFcVersion();
  }

  async getBuildInfo() {
    return this.msp.getBuildInfo();
  }

  async getBoardInfo() {
    return this.msp.getBoardInfo();
  }

  async getUid() {
    return this.msp.getUid();
  }

  async enable4WayInterface() {
    return this.msp.set4WayIf();
  }

  async fourWayWriteSettings(index, esc, settings) {
    return this.fourWay.writeSettings(index, esc, settings);
  }

  async fourWayWriteHex(index, esc, hex, cbProgress) {
    return this.fourWay.writeHex(index, esc, hex, cbProgress);
  }

  async fourWayStart() {
    this.fourWay.start();
  }

  async fourWayExit() {
    return this.fourWay.exit();
  }

  async fourWayReset(esc) {
    return this.fourWay.reset(esc);
  }

  async fourWayTestAlive() {
    return this.fourWay.testAlive();
  }

  async fourWayReadEEprom(address, bytes) {
    return this.fourWay.readEEprom(
      address,
      bytes
    );
  }

  async fourWayInitFlash(esc) {
    return this.fourWay.initFlash(esc);
  }

  async fourWayGetInfo(esc) {
    return this.fourWay.getInfo(esc);
  }

  async write(buffer) {
    if(this.writer) {
      await this.writer.write(buffer);
    }
  }

  async startReader() {
    while(this.running) {
      try {
        const { value } = await this.reader.read();
        if(value) {
          this.qp.addData(value);
        }
      } catch(e) {
        console.debug('Reader failed', e);
        return;
      }
    }
  }

  async open(baudRate) {
    await this.port.open({ baudRate });

    try {
      this.writer = await this.port.writable.getWriter();
      this.reader = await this.port.readable.getReader();
    } catch(e) {
      console.debug('Port not read or writable');
      throw new Error('Port not read or writable');
    }

    this.msp = new Msp(this.executeCommand);
    this.fourWay = new FourWay(this.executeCommand);

    this.running = true;
    this.startReader();
  }

  disconnect() {
    this.running = false;
    this.reader = null;
    this.writer = null;
  }

  async close() {
    this.running = false;

    await this.fourWay.exit();

    this.reader.cancel();
    await this.reader.releaseLock();
    await this.writer.releaseLock();
    await this.port.close();
  }
}

export default Serial;
