import React from 'react';
import {
  render,
  screen,
  fireEvent,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import presets from '../../../melodies.json';

import MelodyEditor from '../';

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key) => key }) }));

test('loads and displays MelodyEditor without melodies', () => {
  const onClose = jest.fn();
  const onSave = jest.fn();
  const melodies = [null, null, null, null];

  render(
    <MelodyEditor
      melodies={melodies}
      onClose={onClose}
      onSave={onSave}
      presets={[]}
      writing={false}
    />
  );

  expect(screen.getAllByText('common:melodyEditorPlay').length).toEqual(1);
  expect(screen.getAllByText(/common:melodyEditorAccept/i).length).toEqual(1);
  expect(screen.queryByText(/common:melodyEditorStop/i)).not.toBeInTheDocument();
  expect(screen.getAllByText(/Please supply a value and an onChange parameter./i).length).toEqual(2);
  expect(screen.getByText(/close/i)).toBeInTheDocument();
  expect(screen.getByText(/save/i)).toBeInTheDocument();

  userEvent.click(screen.getByText(/save/i));
  expect(onSave).not.toHaveBeenCalled();

  userEvent.click(screen.getByText(/close/i));
  expect(onClose).toHaveBeenCalled();
});

test('loads and displays MelodyEditor with different melodies', () => {
  const onClose = jest.fn();
  const onSave = jest.fn();

  const melody = "simpsons:d=4,o=5,b=160:c.6, e6, f#6, 8a6, g.6, e6, c6, 8a, 8f#, 8f#, 8f#, 2g, 8p, 8p, 8f#, 8f#, 8f#, 8g, a#., 8c6, 8c6, 8c6, c6";
  const melodies = [melody, melody, melody, `${melody}, f#6`];

  render(
    <MelodyEditor
      melodies={melodies}
      onClose={onClose}
      onSave={onSave}
      presets={[]}
      writing={false}
    />
  );

  expect(screen.getByText(/ESC 1/i)).toBeInTheDocument();
  expect(screen.getByText(/ESC 2/i)).toBeInTheDocument();
  expect(screen.getByText(/ESC 3/i)).toBeInTheDocument();
  expect(screen.getByText(/ESC 4/i)).toBeInTheDocument();
  expect(screen.getAllByText('common:melodyEditorPlay').length).toEqual(4);
  expect(screen.getByText('common:melodyEditorPlayAll')).toBeInTheDocument();
  expect(screen.getAllByText(/common:melodyEditorAccept/i).length).toEqual(4);
  expect(screen.queryByText(/common:melodyEditorStop/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Please supply a value and an onChange parameter./i)).not.toBeInTheDocument();
  expect(screen.getByText(/close/i)).toBeInTheDocument();
  expect(screen.getByText(/save/i)).toBeInTheDocument();

  const acceptButtons = screen.getAllByText(/common:melodyEditorAccept/i);
  for(let i = 0; i < acceptButtons.length; i += 1) {
    userEvent.click(acceptButtons[i]);
  }
  userEvent.click(screen.getByText(/write/i));
  expect(onSave).toHaveBeenCalled();

  userEvent.click(screen.getByText(/close/i));
  expect(onClose).toHaveBeenCalled();
});

test('loads and displays MelodyEditor with different play all', () => {
  const onClose = jest.fn();
  const onSave = jest.fn();

  const melody = "simpsons:d=4,o=5,b=160:c.6, e6, f#6, 8a6, g.6, e6, c6, 8a, 8f#, 8f#, 8f#, 2g, 8p, 8p, 8f#, 8f#, 8f#, 8g, a#., 8c6, 8c6, 8c6, c6";
  const melodies = [melody, melody, melody, `${melody}, f#6`];

  render(
    <MelodyEditor
      melodies={melodies}
      onClose={onClose}
      onSave={onSave}
      presets={[]}
      writing={false}
    />
  );

  expect(screen.getByText(/ESC 1/i)).toBeInTheDocument();
  expect(screen.getByText(/ESC 2/i)).toBeInTheDocument();
  expect(screen.getByText(/ESC 3/i)).toBeInTheDocument();
  expect(screen.getByText(/ESC 4/i)).toBeInTheDocument();
  expect(screen.getAllByText('common:melodyEditorPlay').length).toEqual(4);
  expect(screen.getByText('common:melodyEditorPlayAll')).toBeInTheDocument();
  expect(screen.getAllByText(/common:melodyEditorAccept/i).length).toEqual(4);
  expect(screen.queryByText(/common:melodyEditorStop/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Please supply a value and an onChange parameter./i)).not.toBeInTheDocument();
  expect(screen.getByText(/close/i)).toBeInTheDocument();
  expect(screen.getByText(/save/i)).toBeInTheDocument();

  const acceptButtons = screen.getAllByText(/common:melodyEditorAccept/i);
  for(let i = 0; i < acceptButtons.length; i += 1) {
    userEvent.click(acceptButtons[i]);
  }

  // Not available because of missing audio context
  /*
  userEvent.click(screen.getByText(/common:melodyEditorPlayAll/i));
  expect(screen.getByText('common:melodyEditorStopAll')).toBeInTheDocument();

  userEvent.click(screen.getByText(/common:melodyEditorStopAll/i));

  expect(screen.getByText('common:melodyEditorPlayAll')).toBeInTheDocument();
  */
});

test('loads and displays MelodyEditor with melodies while writing', () => {
  const onClose = jest.fn();
  const onSave = jest.fn();

  const melody = "simpsons:d=4,o=5,b=160:c.6, e6, f#6, 8a6, g.6, e6, c6, 8a, 8f#, 8f#, 8f#, 2g, 8p, 8p, 8f#, 8f#, 8f#, 8g, a#., 8c6, 8c6, 8c6, c6";
  const melodies = [melody, melody, melody, `${melody}, f#6`];

  render(
    <MelodyEditor
      melodies={melodies}
      onClose={onClose}
      onSave={onSave}
      presets={[]}
      writing
    />
  );

  expect(screen.getByText(/ESC 1/i)).toBeInTheDocument();
  expect(screen.getByText(/ESC 2/i)).toBeInTheDocument();
  expect(screen.getByText(/ESC 3/i)).toBeInTheDocument();
  expect(screen.getByText(/ESC 4/i)).toBeInTheDocument();
  expect(screen.getAllByText('common:melodyEditorPlay').length).toEqual(4);
  expect(screen.getByText('common:melodyEditorPlayAll')).toBeInTheDocument();
  expect(screen.getAllByText(/common:melodyEditorAccept/i).length).toEqual(4);
  expect(screen.queryByText(/common:melodyEditorStop/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Please supply a value and an onChange parameter./i)).not.toBeInTheDocument();
  expect(screen.getByText(/close/i)).toBeInTheDocument();
  expect(screen.getByText(/save/i)).toBeInTheDocument();

  userEvent.click(screen.getByText(/save/i));
  expect(onSave).not.toHaveBeenCalled();

  userEvent.click(screen.getByText(/close/i));
  expect(onClose).toHaveBeenCalled();
});

test('loads and displays MelodyEditor with synced', () => {
  const onClose = jest.fn();
  const onSave = jest.fn();

  const melody = "simpsons:d=4,o=5,b=160:c.6, e6, f#6, 8a6, g.6, e6, c6, 8a, 8f#, 8f#, 8f#, 2g, 8p, 8p, 8f#, 8f#, 8f#, 8g, a#., 8c6, 8c6, 8c6, c6";
  const melodies = [melody, melody, melody, melody];

  render(
    <MelodyEditor
      melodies={melodies}
      onClose={onClose}
      onSave={onSave}
      presets={[]}
      writing={false}
    />
  );

  expect(screen.getByText(/common:allEscs/i)).toBeInTheDocument();
  expect(screen.getAllByText('common:melodyEditorPlay').length).toEqual(1);
  expect(screen.getAllByText(/common:melodyEditorAccept/i).length).toEqual(1);
  expect(screen.queryByText(/common:melodyEditorStop/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Please supply a value and an onChange parameter./i)).not.toBeInTheDocument();
  expect(screen.getByText(/close/i)).toBeInTheDocument();
  expect(screen.getByText(/save/i)).toBeInTheDocument();
  expect(screen.getByRole(/checkbox/i)).toBeInTheDocument();

  userEvent.click(screen.getByRole(/checkbox/i));
  expect(screen.getByText(/ESC 1/i)).toBeInTheDocument();
  expect(screen.getByText(/ESC 2/i)).toBeInTheDocument();
  expect(screen.getByText(/ESC 3/i)).toBeInTheDocument();
  expect(screen.getByText(/ESC 4/i)).toBeInTheDocument();

  userEvent.click(screen.getByText(/common:melodyEditorWrite/i));
  expect(onSave).not.toHaveBeenCalled();

  const acceptButtons = screen.getAllByText(/common:melodyEditorAccept/i);
  for(let i = 0; i < acceptButtons.length; i += 1) {
    userEvent.click(acceptButtons[i]);
  }
  userEvent.click(screen.getByText(/common:melodyEditorWrite/i));
  expect(onSave).toHaveBeenCalled();

  /*
  userEvent.click(screen.getByText(/save/i));
  expect(onSave).not.toHaveBeenCalled();

  userEvent.click(screen.getByText(/close/i));
  expect(onClose).toHaveBeenCalled();
  */
});

test('update preset', () => {
  const onClose = jest.fn();
  const onSave = jest.fn();

  const melody = "simpsons:d=4,o=5,b=160:c.6, e6, f#6, 8a6, g.6, e6, c6, 8a, 8f#, 8f#, 8f#, 2g, 8p, 8p, 8f#, 8f#, 8f#, 8g, a#., 8c6, 8c6, 8c6, c6";
  const melodies = [melody, melody, melody, melody];

  render(
    <MelodyEditor
      melodies={melodies}
      onClose={onClose}
      onSave={onSave}
      presets={presets}
      writing={false}
    />
  );

  fireEvent.change(screen.getByRole('combobox'), {
    target: {
      name: "",
      value: "[\"bluejay:b=570,o=4,d=32:4b,p,4e5,p,4b,p,4f#5,2p,4e5,2b5,8b5\"]",
    },
  });
  expect(screen.queryAllByText(/bluejay:b=570,o=4,d=32/i).length).toEqual(2);
});
