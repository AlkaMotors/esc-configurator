import PropTypes from 'prop-types';
import React from 'react';
import {
  useTranslation,
} from 'react-i18next';
import './style.scss';

function PortPicker({
  hasPort,
  open,
  onSetPort,
  onSetBaudRate,
  onConnect,
  onDisconnect,
  ports,
  onChangePort,
}) {
  const { t } = useTranslation('common');

  const portOptions = ports.map((item, index) => {
    const info = item.getInfo();
    const name = `${info.usbVendorId}:${info.usbProductId}`;
    return (
      <option
        key={name}
        value={index}
      >
        {name}
      </option>
    );
  });

  const rates = [115200, 57600, 38400, 28800, 19200, 14400, 9600, 4800, 2400, 1200];
  const rateElements = rates.map((rate) => (
    <option
      key={rate}
      value={rate}
    >
      {rate}
    </option>
  ));

  function changeBaudRate(e) {
    onSetBaudRate(e.target.value);
  }

  function changePort(e) {
    onChangePort(e.target.value);
  }

  function ConnectionButton() {
    if (open) {
      return (
        <>
          <div className="connect_b">
            <a
              className="connect active"
              href="#"
              onClick={onDisconnect}
            />
          </div>

          <a className="connect-state">
            {t('disconnect')}
          </a>
        </>
      );
    }

    return (
      <>
        <div className="connect_b">
          <a
            className="connect"
            href="#"
            onClick={onConnect}
          />
        </div>

        <a className="connect-state">
          {t('connect')}
        </a>
      </>
    );
  }

  return (
    <div id="port-picker">
      { !hasPort &&
        <div id="serial-permission-overlay">
          <button
            onClick={onSetPort}
            type="button"
          >
            {t('serialPermission')}
          </button>
        </div>}

      <div id="portsinput">
        <div className="dropdown dropdown-dark">
          <select
            className="dropdown-select"
            disabled={open ? true : false}
            id="port"
            onChange={changePort}
            title={t('port')}
          >
            {portOptions}
          </select>
        </div>

        <div className="dropdown dropdown-dark">
          <select
            className="dropdown-select"
            defaultValue="115200"
            disabled={open ? true : false}
            id="baud"
            onChange={changeBaudRate}
            title={t('baudRate')}
          >
            {rateElements}
          </select>
        </div>
      </div>

      <div
        className="connect_controls"
        id="connect-button-wrapper"
      >
        <ConnectionButton />
      </div>
    </div>
  );
}

PortPicker.propTypes = {
  hasPort: PropTypes.bool.isRequired,
  onChangePort: PropTypes.func.isRequired,
  onConnect: PropTypes.func.isRequired,
  onDisconnect: PropTypes.func.isRequired,
  onSetBaudRate: PropTypes.func.isRequired,
  onSetPort: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  ports: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default PortPicker;
