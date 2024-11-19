const ShapeEnum = {
  SQUARE: 0,
  ROUND: 1,
  properties: {
    0: {
      name: "square",
    },
    1: {
      name: "round",
    },
  },
};

const DropboxLoadingStatusEnum = {
  LOADING: 0,
  COMPLETED: 1,
  properties: {
    0: {
      name: "loading",
    },
    1: {
      name: "completed",
    },
  },
};
const SizeEnum = {
  TINY: 0,
  SMALL: 1,
  MEDIUM: 2,
  LARGE1: 3,
  LARGE2: 4,
  HUGE: 5,
  GARGANTUAN: 6,
  properties: {
    0: {
      name: "tiny",
      value: 0,
      code: "T",
      label: "Tiny (0.75x0.75 in)",
    },
    1: {
      name: "small",
      value: 1,
      code: "S",
      label: "Small (1x1 in)",
    },
    2: {
      name: "medium",
      value: 2,
      code: "M",
      label: "Medium (1x1 in)",
    },
    3: {
      name: "large1",
      value: 3,
      code: "L2",
      label: "Large (1.5x1.5 in)",
    },
    4: {
      name: "large2",
      value: 4,
      code: "L1",
      label: "Large (2x2 in)",
    },
    5: {
      name: "huge",
      value: 5,
      code: "H",
      label: "Huge (3x3 in)",
    },
    6: {
      name: "gargantuan",
      value: 6,
      code: "G",
      label: "Gargantuan (4x4 in)",
    },
  },
};

export { ShapeEnum, SizeEnum, DropboxLoadingStatusEnum };
