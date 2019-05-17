# useActivityMonitor Hook!  👀

## How do I use `useActivityMonitor`?

Awesome question 🚀! To get started using the `useActivityMonitor` hook, all you need to provide an `object` with a `timeout` in milliseconds and an optional callback function - `onKillSession` which will be called after the user invokes the `killSession` handler.

```jsx
const { promptUser, restoreSession, killSession } = useActivityMonitor({
  timeout: 1000 * 5, // 5 seconds
  onKillSession: () => alert("You've been terminated! 🤖")
});
```

`useActivityMonitor` returns three useful properties - `promptUser`, `restoreSession`, and `killSession`

* `promptUser` is a `boolean` that indicates if the provided `timeout` (ms) has passed.
* `restoreSession` is a callback function that will set `promptUser` to `false` and reset the internal timer.
* `killSession` is a callback function that will also set `promptUser` to `false` but kill the internal timer completely.

<iframe src="https://codesandbox.io/embed/github/iwakoscott/activityHook/tree/master/?fontsize=14" title="new" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
