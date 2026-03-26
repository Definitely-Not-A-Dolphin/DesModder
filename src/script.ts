import DSM from "#DSM";
import "./fonts/style.css";
import window from "#globals";

const query = new URLSearchParams(window.location.search);

function initDsm() {
  const calc = window.Calc;
  const dsm = new DSM(calc, {
    afterDestroy: () => {
      delete window.DSM;
      delete window.DesModder.controller;
      delete window.DesModder.exposedPlugins;

      // `setTimeout` to wait until after the event loop, with the idea that
      // the `destroy()` callee is likely to run `initializeApi()` in the
      // same event loop.
      if (!query.has("dsmTestingSuppressAutoRestart"))
        setTimeout(() => {
          tryInitDsm();
        });
    },
  });

  window.DesModder.controller = dsm;
  // Not used by DesModder, but some external scripts may still reference this
  window.DesModder.exposedPlugins = dsm.enabledPlugins;
  window.DSM = dsm;

  dsm.init();
}

export function tryInitDsm() {
  if (window.Calc !== undefined) initDsm();
  else setTimeout(tryInitDsm, 10);
}

window.DesModder.init = tryInitDsm;

if (!query.has("dsmTestingDelayLoad")) {
  tryInitDsm();
}
