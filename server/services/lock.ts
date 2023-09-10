let opalLock = false;

export async function lockOpalCallback() {
  if (opalLock) {
    throw new Error("lockService: service is locked");
  }
  opalLock = true;
}

export async function unlockOpalCallback() {
  if (!opalLock) {
    throw new Error("unlockService: service is unlocked");
  }
  opalLock = false;
}

export async function waitUntilOpalUnlocked() {
  while (opalLock) {
    console.log("wait for opalLock to be unlocked");
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}
