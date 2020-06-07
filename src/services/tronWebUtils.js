import TronWeb from 'tronweb';

const tronWebInstance = {
  loggedIn: false,
  tronWeb: null,
  contract: null,
  loaded: false,
  loading: null,
};

function pollTronLink(maxTries, pollInterval) {
  return new Promise((resolve) => {
    let tries;
    const timer = setInterval(() => {
      if (window.tronWeb) {
        // Logged in with TronLink
        clearInterval(timer);
        resolve({ tronWeb: window.tronWeb, loggedIn: true });
      }
      if (tries >= maxTries) {
        // No TronLink - Create TronWeb instance for call methods
        const tronApi = new TronWeb({
          fullHost: process.env.VUE_APP_FULL_HOST,
          privateKey: process.env.VUE_APP_PRIVATE_KEY,
        });
        clearInterval(timer);
        resolve({ tronWeb: tronApi, loggedIn: false });
      }
    }, pollInterval);
  });
}

export async function initTronWeb() {
  const { tronWeb, loggedIn } = await pollTronLink(5, 100);
  tronWebInstance.tronWeb = tronWeb;
  tronWebInstance.loggedIn = loggedIn;
  tronWebInstance.contract = await tronWebInstance.tronWeb
    .contract().at(process.env.VUE_APP_CONTRACT_ADDRESS);
  tronWebInstance.loaded = true;
}

export async function getTronWebInstance() {
  if (tronWebInstance.loaded) return tronWebInstance;
  if (!tronWebInstance.loading) {
    tronWebInstance.loading = initTronWeb();
  }
  await tronWebInstance.loading;
  return tronWebInstance;
}
