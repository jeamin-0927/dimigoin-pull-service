const states = [
  {
    "type": "machine",
    "data": {
      "start": "",
      "end": ""
    }
  },
  {
    "type": "machine_time",
    "data": {
      "stay": {
        "washer": [
          "오후 6시 35분",
          "오후 7시 35분",
          "오후 8시 30분",
          "오후 9시 30분",
          "오후 10시 30분",
          "* 오후 12시 00분",
          "* 오후 1시 00분"
        ],
        "dryer": [
          "오후 7시 35분",
          "오후 9시 30분",
          "* 오후 1시 00분"
        ]
      },
      "common": {
        "washer": [
          "오후 6시 35분",
          "오후 7시 35분",
          "오후 8시 30분",
          "오후 9시 30분",
          "오후 10시 30분"
        ],
        "dryer": [
          "오후 7시 35분",
          "오후 9시 30분"
        ]
      }
    }
  },
  {
    "type": "machine_all_time",
    "data": false
  },
  {
    "type": "machine_all_washer",
    "data": false
  },
  {
    "type": "stay",
    "data": {
      "start": "",
      "end": "",
      "grade12Subtract": 0,
      "grade3Add": 1
    }
  },
  {
    "type": "atheletic_current_event",
    "data": ""
  },
  {
    "type": "atheletic_teams_name",
    "data": {
      "left": "선생님",
      "right": "학생회"
    }
  },
  {
    "type": "bamboo",
    "count": 0
  },
  {
    "type": "bamboo_comment",
    "count": {}
  },
  {
    "type": "class_stay",
    "data": {
      "1": false,
      "2": false,
      "3": false
    }
  },
  {
    "type": "wakeup_selected",
    "data": {
      "male": {
        "title": "",
        "id": "",
        "date": ""
      },
      "female": {
        "title": "",
        "id": "",
        "date": ""
      }
    }
  }
];

export default states;
