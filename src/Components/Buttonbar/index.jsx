import PropTypes from 'prop-types';
import React from 'react';
import {
  useTranslation,
} from 'react-i18next';

import './style.scss';

function Buttonbar({
  onReadSetup,
  onWriteSetup,
  onSeletFirmwareForAll,
  onResetDefaults,
  onSaveLog,
  canRead,
  canWrite,
  canFlash,
  canResetDefaults,
}) {
  const { t } = useTranslation('common');

  function ResetDefaultButton() {
    return (
      <button
        className={canResetDefaults ? "" : "disabled"}
        onClick={onResetDefaults}
        type="button"
      >
        {t('resetDefaults')}
      </button>
    );
  }

  return (
    <div id="button-bar">
      <div className="buttons-left">
        <div className="btn log">
          <button
            onClick={onSaveLog}
            type="button"
          >
            {t('escButtonSaveLog')}
          </button>
        </div>

        <div className={`mobile-show ${canResetDefaults ? "btn" : "hidden"}`}>
          <ResetDefaultButton />
        </div>
      </div>

      <div className="buttons-right">
        <div className="btn">
          <button
            className={canRead ? "" : "disabled"}
            onClick={onReadSetup}
            type="button"
          >
            {t('escButtonRead')}
          </button>
        </div>

        <div className="btn">
          <button
            className={canWrite ? "" : "disabled"}
            onClick={onWriteSetup}
            type="button"
          >
            {t('escButtonWrite')}
          </button>
        </div>

        <div className="btn">
          <button
            className={canFlash ? "" : "disabled"}
            onClick={onSeletFirmwareForAll}
            type="button"
          >
            {t('escButtonFlashAll')}
          </button>
        </div>

        <div className={`mobile-hide ${canResetDefaults ? "btn" : "hidden"}`}>
          <ResetDefaultButton />
        </div>
      </div>
    </div>
  );
}

Buttonbar.propTypes = {
  canFlash: PropTypes.bool.isRequired,
  canRead: PropTypes.bool.isRequired,
  canResetDefaults: PropTypes.bool.isRequired,
  canWrite: PropTypes.bool.isRequired,
  onReadSetup: PropTypes.func.isRequired,
  onResetDefaults: PropTypes.func.isRequired,
  onSaveLog: PropTypes.func.isRequired,
  onSeletFirmwareForAll: PropTypes.func.isRequired,
  onWriteSetup: PropTypes.func.isRequired,
};

export default Buttonbar;
