import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React from 'react';

import Home from '../Home';
import Flash from '../Flash';
import Buttonbar from '../Buttonbar';
import FirmwareSelector from '../FirmwareSelector';
import Changelog from '../../Components/Changelog';
import MotorControl from '../../Components/MotorControl';

import './style.scss';

function MainContent({
  appSettings,
  open,
  escs,
  settings,
  progress,
  mspFeatures,
  onIndividualSettingsUpdate,
  onCancelFirmwareSelection,
  onOpenMelodyEditor,
  onSelectFirmwareForAll,
  onSettingsUpdate,
  onReadEscs,
  onResetDefaultls,
  onSingleFlash,
  onWriteSetup,
  onFlashUrl,
  onSaveLog,
  configs,
  flashTargets,
  onLocalSubmit,
  changelogEntries,
  actions,
  onAllMotorSpeed,
  onSingleMotorSpeed,
  connected,
  fourWay,
}) {
  const { t } = useTranslation('common');

  const {
    isSelecting,
    isFlashing,
    isReading,
    isWriting,
  } = actions;
  const canWrite = (escs.length > 0) && !isSelecting && settings && !isFlashing && !isReading && !isWriting;
  const canFlash = (escs.length > 0) && !isSelecting && !isWriting && !isFlashing && !isReading;
  const canRead = !isReading && !isWriting && !isSelecting && !isFlashing;
  const showMelodyEditor = escs.length > 0 && escs[0].individualSettings.STARTUP_MELODY ? true : false;

  if (!open) {
    return (
      <>
        <Home
          onOpenMelodyEditor={onOpenMelodyEditor}
        />

        <Changelog entries={changelogEntries} />
      </>
    );
  }

  function FlashWrapper() {
    if(fourWay) {
      return (
        <Flash
          availableSettings={settings}
          canFlash={canFlash}
          directInput={appSettings.directInput.value}
          escCount={connected}
          escs={escs}
          flashProgress={progress}
          onFlash={onSingleFlash}
          onIndividualSettingsUpdate={onIndividualSettingsUpdate}
          onSettingsUpdate={onSettingsUpdate}
        />
      );
    }

    return null;
  }

  function MotorControlWrapper() {
    if(!fourWay && !actions.isReading) {
      return (
        <MotorControl
          motorCount={connected}
          onAllUpdate={onAllMotorSpeed}
          onSingleUpdate={onSingleMotorSpeed}
          startValue={mspFeatures['3D'] ? 1500 : 1000}
        />
      );
    }

    return null;
  }

  function WarningWrapper() {
    return (
      <div className="note">
        <p>
          <span dangerouslySetInnerHTML={{ __html: t('notePropsOff') }} />

          <br />

          <span dangerouslySetInnerHTML={{ __html: t('noteConnectPower') }} />
        </p>
      </div>
    );
  }

  if (isSelecting) {
    const targetIndex = flashTargets[0];
    const esc = escs.find((esc) => esc.index === targetIndex);
    return (
      <div id="content">
        <div className="tab toolbar_fixed_bottom">
          <div className="content_wrapper">
            <FirmwareSelector
              configs={configs}
              escHint={esc ? esc.settings.LAYOUT : null}
              onCancel={onCancelFirmwareSelection}
              onLocalSubmit={onLocalSubmit}
              onSubmit={onFlashUrl}
              signatureHint={esc ? esc.meta.signature : null}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div id="content">
        <div className="tab toolbar_fixed_bottom">
          <div className="content_wrapper">
            <WarningWrapper />

            <FlashWrapper />

            <MotorControlWrapper />
          </div>
        </div>
      </div>

      <Buttonbar
        canFlash={canFlash}
        canRead={canRead}
        canResetDefaults={canWrite}
        canWrite={canWrite}
        onOpenMelodyEditor={onOpenMelodyEditor}
        onReadSetup={onReadEscs}
        onResetDefaults={onResetDefaultls}
        onSaveLog={onSaveLog}
        onSeletFirmwareForAll={onSelectFirmwareForAll}
        onWriteSetup={onWriteSetup}
        showMelodyEditor={showMelodyEditor}
      />
    </>
  );
}

MainContent.defaultProps = {
  appSettings: { directInput: { value: false } },
  changelogEntries: [],
  connected: 0,
  escs: [],
  flashTargets: [],
  fourWay: false,
  mspFeatures: { '3D': false },
  open: false,
  progress: [],
  settings: {},
};

MainContent.propTypes = {
  actions: PropTypes.shape({
    isFlashing: PropTypes.bool.isRequired,
    isReading: PropTypes.bool.isRequired,
    isSelecting: PropTypes.bool.isRequired,
    isWriting: PropTypes.bool.isRequired,
  }).isRequired,
  appSettings: PropTypes.shape({ directInput: PropTypes.shape() }),
  changelogEntries: PropTypes.arrayOf(PropTypes.shape()),
  configs: PropTypes.shape({
    escs: PropTypes.shape().isRequired,
    pwm: PropTypes.shape().isRequired,
    versions: PropTypes.shape().isRequired,
  }).isRequired,
  connected: PropTypes.number,
  escs: PropTypes.arrayOf(PropTypes.shape()),
  flashTargets: PropTypes.arrayOf(PropTypes.number),
  fourWay: PropTypes.bool,
  mspFeatures: PropTypes.shape({ '3D': PropTypes.bool }),
  onAllMotorSpeed: PropTypes.func.isRequired,
  onCancelFirmwareSelection: PropTypes.func.isRequired,
  onFlashUrl: PropTypes.func.isRequired,
  onIndividualSettingsUpdate: PropTypes.func.isRequired,
  onLocalSubmit: PropTypes.func.isRequired,
  onOpenMelodyEditor: PropTypes.func.isRequired,
  onReadEscs: PropTypes.func.isRequired,
  onResetDefaultls: PropTypes.func.isRequired,
  onSaveLog: PropTypes.func.isRequired,
  onSelectFirmwareForAll: PropTypes.func.isRequired,
  onSettingsUpdate: PropTypes.func.isRequired,
  onSingleFlash: PropTypes.func.isRequired,
  onSingleMotorSpeed: PropTypes.func.isRequired,
  onWriteSetup: PropTypes.func.isRequired,
  open: PropTypes.bool,
  progress: PropTypes.arrayOf(PropTypes.number),
  settings: PropTypes.shape(),
};

export default MainContent;
