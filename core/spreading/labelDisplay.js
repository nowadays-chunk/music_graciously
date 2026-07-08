export const LABEL_DISPLAY_MODES = ['notes', 'fingering', 'intervals'];
export const DEFAULT_LABEL_DISPLAY = 'notes';

export const normalizeLabelDisplay = (value, fallback = DEFAULT_LABEL_DISPLAY) => {
  if (LABEL_DISPLAY_MODES.includes(value)) return value;
  return fallback;
};

export const isValidLabelDisplay = (value) => LABEL_DISPLAY_MODES.includes(value);

export const getLabelDisplayFromSettings = (generalSettings = {}) => {
  if (isValidLabelDisplay(generalSettings.labelDisplay)) {
    return generalSettings.labelDisplay;
  }

  return generalSettings.notesDisplay ? 'notes' : 'intervals';
};

export const appendLabelDisplayToPath = (path, labelDisplay = DEFAULT_LABEL_DISPLAY) =>
  `${path}/${normalizeLabelDisplay(labelDisplay)}`;
