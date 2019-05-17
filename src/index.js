import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import { Dialog } from "@material-ui/core";

function useActivityMonitor({
  timeout,
  events = ["load", "mousemove", "mousedown", "click", "scroll", "keypress"],
  onKillSession = () => ({})
}) {
  const [state, dispatch] = React.useReducer(
    (state, action) => {
      switch (action.type) {
        case "KILL_SESSION":
          return { ...state, promptUser: false, active: false  };
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
      reset: false,
      active: true
    }
  );
  const idleTimeRef = React.useRef(null);
  const functionRef = React.useRef(null);

  const { reset, promptUser, active } = state;

  const resetTimer = () => dispatch({ type: "RESET_IDLE_TIMER" });
  const killSession = () => {
    dispatch({ type: "KILL_SESSION" }); 
    onKillSession();
};

  React.useEffect(() => {
    if (active){
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
    }
  }, [events, timeout, reset]);

  return { promptUser, resetTimer, killSession };
}

function App() {
  const SECONDS = 1;
  const [authed, setAuthed] = React.useState(true);
  const { promptUser, resetTimer, killSession } = useActivityMonitor({
    timeout: 1000 * SECONDS,
    onKillSession: () => setAuthed(false)
  });

  const handleLogout = () => killSession();

  return (
    <>
     <h1>{ authed ? `Wait ${SECONDS} seconds...` : "You've been succesfully logged out! 🚪"}</h1>
      <Dialog open={promptUser}>
        <div style={{ padding: "1em" }}>
          <h1>Are you still there?</h1>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={handleLogout}>Logout?</button>
            <button onClick={resetTimer}>Continue Session</button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
