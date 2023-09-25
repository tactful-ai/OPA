let opalLock = false;

export async function lockOpalCallback() {
  opalLock = true;
}

export async function unlockOpalCallback() {
  opalLock = false;
}

export async function waitUntilOpalUnlocked() {
  const timeout = 10;
  let counter = 0;
  while (opalLock) {
    if (counter > timeout) {
      throw new Error("opalLock timeout");
    }
    counter++;
    console.log("wait for opalLock to be unlocked");
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  console.log("received opalLock unlocked");
}
