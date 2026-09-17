/* ==========================================================================
   ING IRC — Firebase authentication (Sign Up / Log In + email verification).
   UI toggling uses the same Tailwind utility classes as app.js.
   ========================================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBHtLTowNeKRrUP5wPtE_TxZ2AL8pR1CgQ",
  authDomain: "ircri-234e8.firebaseapp.com",
  projectId: "ircri-234e8",
  storageBucket: "ircri-234e8.firebasestorage.app",
  messagingSenderId: "554090441383",
  appId: "1:554090441383:web:ee90d7328130f3ec4dc982",
  measurementId: "G-K3XQTXDEQ1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
let currentAuthMode = 'SIGNUP';

/* Tailwind class sets for the auth modal (mirrors app.js modal plumbing) */
const TAB_ACTIVE = 'inline-flex flex-1 cursor-pointer items-center justify-center gap-[9px] rounded-full border-2 border-transparent bg-brand px-[22px] py-[11px] text-sm font-extrabold text-white transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-brandh hover:shadow-[4px_4px_0_var(--yellow)]';
const TAB_IDLE   = 'inline-flex flex-1 cursor-pointer items-center justify-center gap-[9px] rounded-full border-2 border-link bg-transparent px-[22px] py-[11px] text-sm font-extrabold text-ink transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-surfacehover hover:shadow-[4px_4px_0_var(--yellow)]';

function openAuthModal(){
  const b = document.getElementById('authModal');
  b.classList.remove('opacity-0','pointer-events-none');
  b.classList.add('show','opacity-100','pointer-events-auto');
  b.querySelector('.modal').classList.remove('translate-y-[18px]');
  document.body.classList.add('overflow-hidden');
}
function closeAuthModal(){
  const b = document.getElementById('authModal');
  b.classList.remove('show','opacity-100','pointer-events-auto');
  b.classList.add('opacity-0','pointer-events-none');
  b.querySelector('.modal').classList.add('translate-y-[18px]');
  document.body.classList.remove('overflow-hidden');
}

window.openAuth = openAuthModal;
window.closeAuth = closeAuthModal;

window.setAuthMode = (mode) => {
  currentAuthMode = mode;
  document.getElementById('authError').classList.add('hidden');
  if(mode === 'SIGNUP') {
    document.getElementById('tabSignup').className = TAB_ACTIVE;
    document.getElementById('tabLogin').className = TAB_IDLE;
    document.getElementById('authSubmitBtn').textContent = 'Sign Up';
  } else {
    document.getElementById('tabSignup').className = TAB_IDLE;
    document.getElementById('tabLogin').className = TAB_ACTIVE;
    document.getElementById('authSubmitBtn').textContent = 'Log In';
  }
};

window.handleGoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    await signInWithPopup(auth, provider);
  } catch(err) {
    const errEl = document.getElementById('authError');
    errEl.textContent = err.message;
    errEl.classList.remove('hidden');
  }
};

window.handleAuthSubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById('authEmail').value;
  const password = document.getElementById('authPassword').value;
  const btn = document.getElementById('authSubmitBtn');
  const errEl = document.getElementById('authError');
  errEl.classList.add('hidden');

  if(!email || !password) {
    errEl.textContent = 'Email and Password are required';
    errEl.classList.remove('hidden');
    return;
  }

  if (password.length < 6) {
    errEl.textContent = 'Password must be at least 6 characters.';
    errEl.classList.remove('hidden');
    return;
  }

  btn.textContent = 'Processing...';
  try {
    if(currentAuthMode === 'SIGNUP') {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }
  } catch(err) {
    if (err.code === 'auth/email-already-in-use') errEl.textContent = 'Email already in use.';
    else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') errEl.textContent = 'Invalid credentials.';
    else errEl.textContent = err.message;
    errEl.classList.remove('hidden');
  } finally {
    btn.textContent = currentAuthMode === 'SIGNUP' ? 'Sign Up' : 'Log In';
  }
};

window.checkVerification = async () => {
  const errEl = document.getElementById('verifyError');
  errEl.classList.add('hidden');
  if(auth.currentUser) {
    await auth.currentUser.reload();
    if(auth.currentUser.emailVerified) {
      closeAuthModal();
      toast('Authentication Successful!');
      updateHeader(auth.currentUser);
    } else {
      errEl.textContent = 'Email not verified yet. Check your inbox and click the link.';
      errEl.classList.remove('hidden');
    }
  }
};

window.resendVerification = async () => {
  if(auth.currentUser) {
    try {
      await sendEmailVerification(auth.currentUser);
      toast('Verification link resent!');
    } catch(err) {
      toast('Error resending link. Please wait a moment.');
    }
  }
};

window.handleSignOut = async () => {
  await signOut(auth);
  toast('Signed out successfully.');
};

const BTN_OUTLINE = 'btn btn-outline inline-flex cursor-pointer items-center gap-[9px] rounded-full border-2 border-link bg-transparent px-[22px] py-[11px] text-sm font-extrabold text-ink transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-surfacehover hover:shadow-[4px_4px_0_var(--yellow)] max-[720px]:hidden';

function updateHeader(user) {
  const navBtn = document.getElementById('navSignInBtn');
  if (!navBtn) return;

  if(user && user.emailVerified) {
    navBtn.outerHTML = `
      <div id="navSignInBtn" class="flex select-none items-center gap-3 rounded-full border-2 border-line bg-surface py-1 pr-4 pl-1">
        <div class="flex h-8 w-8 items-center justify-center rounded-full border-2 border-contrast bg-brand text-xs font-extrabold text-white shadow-[3px_3px_0_var(--yellow)]">
          ${user.email.substring(0,2).toUpperCase()}
        </div>
        <button onclick="handleSignOut()" class="cursor-pointer border-none bg-transparent p-0 font-syne text-[13.5px] font-extrabold text-ink transition-colors hover:text-crimson">
          Sign Out
        </button>
      </div>
    `;
  } else {
    if (navBtn.tagName !== 'BUTTON') {
      navBtn.outerHTML = `<button class="${BTN_OUTLINE}" id="navSignInBtn" onclick="openAuth()">Sign In</button>`;
    } else {
      navBtn.innerHTML = 'Sign In';
      navBtn.onclick = window.openAuth;
      navBtn.className = BTN_OUTLINE;
    }
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (user.emailVerified) {
      document.getElementById('authFormView').classList.remove('hidden');
      document.getElementById('authVerifyView').classList.add('hidden');
      closeAuthModal();
      updateHeader(user);
    } else {
      // Needs verification
      document.getElementById('authFormView').classList.add('hidden');
      document.getElementById('authVerifyView').classList.remove('hidden');
      openAuthModal();
      updateHeader(null);
    }
  } else {
    document.getElementById('authFormView').classList.remove('hidden');
    document.getElementById('authVerifyView').classList.add('hidden');
    updateHeader(null);
  }
});
