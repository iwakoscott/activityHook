import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import { Dialog } from "@material-ui/core";

function useActivityMonitor({
  timeout,
  events = ["load", "mousemove", "mousedown", "click", "scroll", "keypress"]
}) {
  const [state, dispatch] = React.useReducer(
    (state, action) => {
      switch (action.type) {
        case "PROMPT_USER":
          return { ...state, promptUser: true };
        case "RESET_IDLE_TIMER":
          return { ...state, promptUser: false, reset: true };
        default:
          return state;
      }
    },
    {
      promptUser: false,
      reset: false
    }
  );
  const idleTimeRef = React.useRef(null);
  const functionRef = React.useRef(null);

  const { reset, promptUser } = state;

  const resetTimer = () => dispatch({ type: "RESET_IDLE_TIMER" });

  React.useEffect(() => {
    function onResetIdleTimer() {
      resetTimer();
      // TODO: clear old timer and set new timer
      clearTimeout(idleTimeRef.current);
      idleTimeRef.current = setTimeout(notify, timeout);
    }

    function notify() {
      dispatch({ type: "PROMPT_USER" });
      for (let type of events) {
        window.removeEventListener(type, functionRef.current);
      }
      clearTimeout(idleTimeRef.current);
    }

    // TODO: start timer
    idleTimeRef.current = setTimeout(notify, timeout);
    functionRef.current = onResetIdleTimer;

    for (let type of events) {
      window.addEventListener(type, functionRef.current, false);
    }

    return () => {
      for (let type of events) {
        window.removeEventListener(type, functionRef.current);
      }
      clearTimeout(idleTimeRef.current);
    };
  }, [events, timeout, reset]);

  return { promptUser, resetTimer };
}

function App() {
  const seconds = 10;
  const { promptUser, resetTimer } = useActivityMonitor({
    timeout: 1000 * seconds
  });

  return (
    <>
      <h1>Wait {seconds} seconds...</h1>
      <Dialog open={promptUser}>
        <div style={{ padding: "1em" }}>
          <h1>Are you still there?</h1>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button>Logout?</button>
            <button onClick={resetTimer}>Continue Session</button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
