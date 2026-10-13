# Casino Huge Win — Phaser 3 Playable

A short, scripted slot-machine playable rebuilt in Phaser 3 from an older Phaser 2 project. I used it to revisit a familiar playable-ad interaction with updated scene structure, reel motion, and animation timing.

**[Live demo](https://zanderjacobsen.github.io/Casino_hugeWin/)** · **[Source code](https://github.com/ZanderJacobsen/Casino_hugeWin)**

The flow is intentionally simple: press **SPIN**, watch five reels stop, and see the result through symbol highlights, a changing money meter, and win effects. The outcomes are staged for the demo; this isn't a full slot game or a random payout system.

## What I worked on

- Built the five reels using reusable vertical-list components rather than animating each symbol independently.
- Sequenced reel movement, stopping, result highlights, and resets with Phaser timers and tweens.
- Split interaction and presentation into game, UI, tutorial, and end-screen scenes.
- Added animated button states, coin effects, and money-meter feedback to make each step of the sequence readable.

The interesting part is the timing: getting the reels, input states, and reward effects to hand off cleanly so the interaction feels like one continuous flow.

## Where to look in the code

| File | Responsibility |
| --- | --- |
| [`SpinBoard.js`](src/game/prefabs/SpinBoard.js) | Five-reel setup, spin phases, stopping, highlights, and resets. |
| [`List3DBar.js`](src/game/prefabs/List3DBar.js) | Scrollable list used to position and move symbols inside each reel. |
| [`SpinItem.js`](src/game/prefabs/SpinItem.js) | Slot-symbol display and selection/blur effects. |
| [`CTA.js`](src/game/prefabs/CTA.js) | Spin button and its visual states. |
| [`MoneyMeter.js`](src/game/prefabs/MoneyMeter.js) | Money counter and coin feedback. |
| [`Game.js`](src/game/scenes/Game.js) / [`UI.js`](src/game/scenes/UI.js) | Event-driven coordination between the reels and on-screen feedback. |

The reel component is related to the list interactions explored separately in my [2.5D List Playground](https://github.com/ZanderJacobsen/Wheel_testZone).

## Run locally

Requires Node.js and npm.

```bash
git clone https://github.com/ZanderJacobsen/Casino_hugeWin.git
cd Casino_hugeWin
npm install
npm run dev-nolog
```

Open the local URL printed by Vite. Build with `npm run build-nolog`.

**Stack:** JavaScript, Phaser 3, React, Vite.
