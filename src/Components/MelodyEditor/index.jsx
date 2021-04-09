import PropTypes from 'prop-types';
import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useTranslation } from 'react-i18next';
import './style.scss';

import LabeledSelect from '../Input/LabeledSelect';
import Checkbox from '../Input/Checkbox';
import MelodyElement from './MelodyElement';

function MelodyEditor({
  dummy,
  melodies,
  onClose,
  onSave,
  presets,
  writing,
}) {
  const { t } = useTranslation();

  const defaultAccepted = melodies.map(() => null);
  const references = melodies.map(() => useRef());
  const uniqueMelodies = [...new Set(melodies)];
  const [allAccepted, setAllAccepted] = useState(false);
  const [sync, setSync] = useState(uniqueMelodies.length <= 1);
  const [currentMelodies, setCurrentMelodies] = useState(melodies);
  const [acceptedMelodies, setAcceptedMelodies] = useState(defaultAccepted);
  const [isAnyPlaying, setIsAnyPlaying] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(-1);
  const totalPlaying = useRef(0);
  const audioContext = useRef(0);

  useEffect(() => {
    checkAllAccepted();
  }, [acceptedMelodies]);

  function handleClose() {
    if(!isAnyPlaying) {
      onClose();
    }
  }

  function checkAllAccepted() {
    let allAccepted = true;
    for(let i = 0; i < acceptedMelodies.length; i += 1) {
      if(!acceptedMelodies[i]) {
        allAccepted = false;
        break;
      }
    }

    setAllAccepted(allAccepted);
  }

  function handleAcceptAll(accept) {
    const acceptedMelodiesNew = acceptedMelodies.map(() => accept);
    setAcceptedMelodies(acceptedMelodiesNew);
  }

  function handleAccept(index, accept) {
    acceptedMelodies[index] = accept;
    setAcceptedMelodies([...acceptedMelodies]);
  }

  function handleChildClick(e) {
    e.stopPropagation();
  }

  function handleSave() {
    setCurrentMelodies([...acceptedMelodies]);
    onSave(acceptedMelodies);
  }

  function handlePlay() {
    totalPlaying.current += 1;
    setIsAnyPlaying(true);
  }

  function handleStop() {
    totalPlaying.current -= 1;
    if(totalPlaying.current === 0) {
      setIsAnyPlaying(false);
      if(audioContext.current) {
        audioContext.current.close();
        audioContext.current = null;
      }
    }
  }

  function handlePlayAll() {
    setIsAnyPlaying(true);

    audioContext.current = new window.AudioContext();
    for(let i = 0; i < references.length; i += 1) {
      const child = references[i];
      child.current.play(audioContext.current, 1 / references.length);
    }
  }

  function handleStopAll() {
    for(let i = 0; i < references.length; i += 1) {
      const child = references[i];
      child.current.stop();
    }
  }

  function toggleSync() {
    handleAcceptAll(false);
    setSync(!sync);
  }

  function updateMelodies(e) {
    const value = e.target.value;
    const selected = JSON.parse(value);
    const newMelodies = [];

    let currentTrack = 0;
    while(newMelodies.length < melodies.length) {
      newMelodies[currentTrack] = selected[currentTrack % selected.length];
      currentTrack += 1;
    }

    setSelectedPreset(value);
    setSync(selected.length === 1);
    setCurrentMelodies(newMelodies);
  }

  function PresetSelect() {
    const possibilities = presets.filter((item) => item.tracks.length <= melodies.length );
    const options = possibilities.map((melody) => {
      if(melody.tracks.length <= melodies.length) {
        return {
          key: melody.name,
          name: melody.name,
          value: JSON.stringify(melody.tracks),
        };
      }
    });

    return(
      <LabeledSelect
        firstLabel={t('common:melodyPresetsLabel')}
        onChange={updateMelodies}
        options={options}
        selected={selectedPreset}
      />
    );
  }

  function MelodyElementSingle({
    accepted,
    index,
    label,
    melody,
    onAccept,
  }) {
    function handleAcceptMelody(accept) {
      onAccept(index, accept);
    }

    return(
      <MelodyElement
        accepted={accepted}
        disabled={writing}
        dummy={dummy}
        label={label}
        melody={melody}
        onAccept={handleAcceptMelody}
        onPlay={handlePlay}
        onStop={handleStop}
        ref={references[index]}
      />
    );
  }
  MelodyElementSingle.propTypes = {
    accepted: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    melody: PropTypes.string.isRequired,
    onAccept: PropTypes.func.isRequired,
  };

  function MelodyElementAll({
    accepted,
    label,
    melody,
  }) {
    return(
      <MelodyElement
        accepted={accepted}
        disabled={writing}
        dummy={dummy}
        label={label}
        melody={melody}
        onAccept={handleAcceptAll}
        onPlay={handlePlay}
        onStop={handleStop}
      />
    );
  }
  MelodyElementAll.propTypes = {
    accepted: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    melody: PropTypes.string.isRequired,
  };

  const melodyElements = useMemo(
    () => currentMelodies.map((melody, index) => (
      <MelodyElementSingle
        accepted={acceptedMelodies[index] ? true : false}
        index={index}
        key={index}
        label={`ESC ${index + 1}`}
        melody={melody}
        onAccept={handleAccept}
      />
    )), [currentMelodies, writing]
  );

  const melodyElement = useMemo(
    () => (
      <MelodyElementAll
        accepted={acceptedMelodies[0] ? true : false}
        label={t("common:allEscs")}
        melody={currentMelodies[0]}
      />
    ), [currentMelodies, writing]
  );

  return (
    <div
      id="melody-editor"
      onClick={handleClose}
    >
      <div
        className="melody-editor-wrapper"
        onClick={handleChildClick}
      >
        <div
          className="close"
          onClick={handleClose}
        >
          {t('settings:closeText')}
        </div>

        <h3>
          {t('common:melodyEditorHeader')}
        </h3>

        <div className="sync-wrapper">
          <Checkbox
            disabled={isAnyPlaying || writing}
            hint={t("common:syncMelodiesHint")}
            label={t("common:syncMelodies")}
            name="syncMelodies"
            onChange={toggleSync}
            value={sync ? 1 : 0}
          />
        </div>

        <PresetSelect />

        <div className={`melody-editor-escs ${sync ? 'all' : ''}`}>
          {!sync && melodyElements}

          {sync && melodyElement}
        </div>

        <div className="default-btn button-wrapper">
          { !sync &&
            <button
              disabled={writing}
              onClick={isAnyPlaying ? handleStopAll : handlePlayAll}
              type="button"
            >
              {isAnyPlaying ? t('common:melodyEditorStopAll') : t('common:melodyEditorPlayAll')}
            </button>}

          { !dummy &&
            <button
              disabled={!allAccepted || isAnyPlaying || writing}
              onClick={handleSave}
              type="button"
            >
              {t('common:melodyEditorSave')}
            </button>}
        </div>
      </div>
    </div>
  );
}

MelodyEditor.propTypes = {
  dummy: PropTypes.bool.isRequired,
  melodies: PropTypes.arrayOf(PropTypes.string).isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  presets: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  writing: PropTypes.bool.isRequired,
};

export default MelodyEditor;
