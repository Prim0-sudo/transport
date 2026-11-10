window.COASTAL_STATION = {
  "W": 1536,
  "H": 1024,
  "cameraX": 770,
  "art": {
    "distant-coast": {
      "width": 1536,
      "height": 1024
    },
    "station-stage": {
      "width": 1536,
      "height": 1024
    },
    "sky-backplate": {
      "width": 1024,
      "height": 683
    },
    "exit-trees": {
      "width": 900,
      "height": 600
    },
    "station-train": {
      "width": 900,
      "height": 117
    },
    "station-bus": {
      "width": 900,
      "height": 380
    },
    "harbour-ferry": {
      "width": 900,
      "height": 329
    },
    "boarding-passenger-0": {
      "width": 204,
      "height": 260
    },
    "boarding-passenger-1": {
      "width": 204,
      "height": 260
    },
    "boarding-passenger-2": {
      "width": 204,
      "height": 260
    },
    "boarding-passenger-3": {
      "width": 204,
      "height": 260
    },
    "runway-plane": {
      "width": 900,
      "height": 387
    },
    "boarding-passenger-2-0": {
      "width": 204,
      "height": 260
    },
    "boarding-passenger-2-1": {
      "width": 204,
      "height": 260
    },
    "boarding-passenger-2-2": {
      "width": 204,
      "height": 260
    },
    "boarding-passenger-2-3": {
      "width": 204,
      "height": 260
    },
    "ferry-gangway": {
      "width": 900,
      "height": 651
    },
    "kerb-stop": {
      "width": 900,
      "height": 709
    },
    "bus-door-closed": {
      "width": 185,
      "height": 437
    },
    "ferry-door-closed": {
      "width": 110,
      "height": 174
    }
  },
  "bus": {
    "x": 545,
    "y": 797.9333333333334,
    "w": 282,
    "exit": 1100,
    "door": [
      181.61,
      15.75,
      35.11,
      82.93
    ],
    "shelter": [
      405,
      862.9844444444444,
      146,
      115.01555555555555
    ]
  },
  "train": {
    "x": 500,
    "y": 656.51,
    "w": 573,
    "arrival": 1110
  },
  "ferry": {
    "x": 725,
    "y": 401.19444444444446,
    "w": 325,
    "arrival": 850,
    "exit": -1110,
    "door": [
      170.64,
      66.9,
      24.86,
      39.33
    ]
  },
  "plane": {
    "x": 163,
    "y": 377.9,
    "w": 70,
    "startX": -240,
    "startY": -100,
    "touchX": -108,
    "liftX": 107,
    "exitX": 1450,
    "exitY": -324
  },
  "occluder": {
    "box": [
      1180,
      717.3333333333333,
      460,
      306.6666666666667
    ]
  },
  "gangway": {
    "box": [
      896,
      489,
      61,
      59
    ]
  },
  "people": [
    {
      "queue": "bus",
      "cast": "boarding-passenger",
      "h": 72,
      "start": [
        698,
        952
      ],
      "path": [
        [
          698,
          952
        ],
        [
          736,
          945
        ],
        [
          746,
          920
        ],
        [
          745,
          898
        ]
      ],
      "at": 4.46,
      "walk": 1.31
    },
    {
      "queue": "bus",
      "cast": "boarding-passenger-2",
      "h": 76,
      "start": [
        649,
        961
      ],
      "path": [
        [
          649,
          961
        ],
        [
          733,
          946
        ],
        [
          745,
          920
        ],
        [
          745,
          898
        ]
      ],
      "at": 5.53,
      "walk": 1.31
    },
    {
      "queue": "bus",
      "cast": "boarding-passenger",
      "h": 65,
      "tint": 61,
      "start": [
        604,
        958
      ],
      "path": [
        [
          604,
          958
        ],
        [
          735,
          944
        ],
        [
          745,
          918
        ],
        [
          745,
          898
        ]
      ],
      "at": 6.48,
      "walk": 1.42
    },
    {
      "queue": "ferry",
      "cast": "boarding-passenger-2",
      "h": 49,
      "face": -1,
      "start": [
        941,
        544
      ],
      "path": [
        [
          941,
          544
        ],
        [
          943,
          537
        ],
        [
          927,
          526
        ],
        [
          909,
          510
        ]
      ],
      "at": 9,
      "walk": 1.28
    },
    {
      "queue": "ferry",
      "cast": "boarding-passenger",
      "h": 47,
      "face": -1,
      "start": [
        967,
        549
      ],
      "path": [
        [
          967,
          549
        ],
        [
          947,
          541
        ],
        [
          926,
          526
        ],
        [
          909,
          510
        ]
      ],
      "at": 10.38,
      "walk": 1.38
    }
  ]
};
