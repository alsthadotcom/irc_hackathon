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

window.openAuth = () => {
  document.getElementById('authModal').classList.add('show');
  document.body.classList.add('modal-open');
};

window.closeAuth = () => {
  document.getElementById('authModal').classList.remove('show');
  document.body.classList.remove('modal-open');
};

window.setAuthMode = (mode) => {
  currentAuthMode = mode;
  document.getElementById('authError').classList.remove('show');
  if(mode === 'SIGNUP') {
    document.getElementById('tabSignup').className = 'btn btn-dark';
    document.getElementById('tabLogin').className = 'btn btn-ghost';
    document.getElementById('authSubmitBtn').textContent = 'Sign Up';
  } else {
    document.getElementById('tabSignup').className = 'btn btn-ghost';
    document.getElementById('tabLogin').className = 'btn btn-dark';
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
    errEl.classList.add('show');
  }
};

window.handleAuthSubmit = async (e) => {
  e.preventDefault();
  const email = document.getElementById('authEmail').value;
  const password = document.getElementById('authPassword').value;
  const btn = document.getElementById('authSubmitBtn');
  const errEl = document.getElementById('authError');
  errEl.classList.remove('show');
  
  if(!email || !password) {
    errEl.textContent = 'Email and Password are required';
    errEl.classList.add('show');
    return;
  }
  
  if (password.length < 6) {
    errEl.textContent = 'Password must be at least 6 characters.';
    errEl.classList.add('show');
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
    errEl.classList.add('show');
  } finally {
    btn.textContent = currentAuthMode === 'SIGNUP' ? 'Sign Up' : 'Log In';
  }
};

window.checkVerification = async () => {
  const errEl = document.getElementById('verifyError');
  errEl.classList.remove('show');
  if(auth.currentUser) {
    await auth.currentUser.reload();
    if(auth.currentUser.emailVerified) {
      window.closeAuth();
      toast('Authentication Successful!');
      updateHeader(auth.currentUser);
    } else {
      errEl.textContent = 'Email not verified yet. Check your inbox and click the link.';
      errEl.classList.add('show');
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

function updateHeader(user) {
  const navBtn = document.getElementById('navSignInBtn');
  if (!navBtn) return;
  
  if(user && user.emailVerified) {
    navBtn.outerHTML = `
      <div id="navSignInBtn" class="chip" style="padding: 4px 16px 4px 4px; gap: 12px; cursor: default; user-select: none;">
        <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg, var(--brand), var(--brand-d));color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;box-shadow: 0 0 14px rgba(47,224,141,0.25); border: 1px solid rgba(47,224,141,0.2);">
          ${user.email.substring(0,2).toUpperCase()}
        </div>
        <button onclick="handleSignOut()" style="background:transparent;border:none;color:var(--muted);font-size:13.5px;font-weight:800;cursor:pointer;transition:color .2s;font-family:inherit;padding:0;" onmouseover="this.style.color='var(--mint)'" onmouseout="this.style.color='var(--muted)'">
          Sign Out
        </button>
      </div>
    `;
  } else {
    if (navBtn.tagName !== 'BUTTON') {
      navBtn.outerHTML = '<button class="btn btn-ghost" id="navSignInBtn" onclick="openAuth()">Sign In</button>';
    } else {
      navBtn.innerHTML = 'Sign In';
      navBtn.onclick = window.openAuth;
      navBtn.className = 'btn btn-ghost';
    }
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (user.emailVerified) {
      document.getElementById('authFormView').style.display = 'block';
      document.getElementById('authVerifyView').style.display = 'none';
      window.closeAuth();
      updateHeader(user);
    } else {
      // Needs verification
      document.getElementById('authFormView').style.display = 'none';
      document.getElementById('authVerifyView').style.display = 'block';
      document.getElementById('authModal').classList.add('show');
      updateHeader(null);
    }
  } else {
    document.getElementById('authFormView').style.display = 'block';
    document.getElementById('authVerifyView').style.display = 'none';
    updateHeader(null);
  }
});
