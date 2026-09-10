# APICDT-Timer
Live timer: [APICDT Timer](https://apicdt-timer.vercel.app/)<br>
Timer requirements: [View timer requirements](https://docs.google.com/document/d/1Nk9HBAHMEnC1wG9tETOre_b7TInnT1uPrAywV-BzSZc/edit?usp=sharing) <br><br>

### About this timer
- All timer stages follow the rules and regulations of the Asia-Pacific Chinese Debate Championship.
- To change the preset match information, edit `contest-data.js`; enter each match in this order: title, affirmative team, affirmative topic, negative team, and negative topic.
- Match data is categorized as `Contest` or `Roadshow`; `apicdtmainNew.html` displays `Contest`, while `apicdtRoadshow.html` displays only `Roadshow`.
- To change the debate format, add, remove, or adjust `title`, `time`, and other special conditions in the `phases` array in `apicdtmainNew.js`.
- The timer is configured to play one bell when 30 seconds remain and two bells when time expires. No bell is played after the "Judges' Comments" or "Buffer Time" phases. Adjust these settings in `apicdtmainNew.js` if needed.

### Contest data format
The editable data is stored in [contest-data.js](contest-data.js). A placeholder-only example is available in [example-contest-data.js](example-contest-data.js).

The file must define a top-level `contestData` object with a `sections` array. Each section contains:

- `title`: the heading shown above the preset buttons
- `category`: use `Contest` for contest mode or `Roadshow` for roadshow mode
- `matches`: an array of match records

Each match record must contain five values in this order:

```text
[title, affirmative team, affirmative topic, negative team, negative topic]
```

The two pages filter by category, so a `Contest` record will not appear in Roadshow Mode and a `Roadshow` record will not appear in Contest Mode.

### Additional (For Local Use)
To show timer in full screen mode: fn + F11<br>
To go back to main page: Ctrl + R<br><br>

### Design Color Reference
Theme colors: #0B204D, #961B1B, #FFCB5A, #F8F0E0
