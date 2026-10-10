// Firebase Google Authentication for Amir Store
// Firebase web configuration is public client-side configuration.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBsjL_DFEFIGzgA32djRRExNAuL5NyFLVM",
  authDomain: "amir-store-92a8e.firebaseapp.com",
  projectId: "amir-store-92a8e",
  storageBucket: "amir-store-92a8e.firebasestorage.app",
  messagingSenderId: "975117448475",
  appId: "1:975117448475:web:eaaf24628be9d783854fbe",
  measurementId: "G-E24BFYFL89"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

const button = document.getElementById("googleAuthButton");
const status = document.getElementById("authStatus");

function showStatus(message, isError = false) {
  if (!status) return;
  status.textContent = message;
  status.classList.toggle("error", isError);
}

button?.addEventListener("click", async () => {
  if (button.dataset.signedIn === "true") {
    try {
      await signOut(auth);
      showStatus("تم تسجيل الخروج.");
    } catch (error) {
      console.error("Firebase sign-out failed:", error);
      showStatus("تعذر تسجيل الخروج. حاول مرة أخرى.", true);
    }
    return;
  }

  button.disabled = true;
  showStatus("جارٍ فتح نافذة Google…");
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Firebase Google sign-in failed:", error);
    const messages = {
      "auth/unauthorized-domain": "يجب إضافة نطاق GitHub Pages إلى النطاقات المصرح بها في Firebase Authentication.",
      "auth/popup-blocked": "المتصفح منع النافذة المنبثقة. اسمح بالنوافذ المنبثقة لهذا الموقع ثم حاول مجددًا.",
      "auth/popup-closed-by-user": "أُغلقت نافذة تسجيل الدخول قبل اكتمال العملية.",
      "auth/operation-not-allowed": "تسجيل Google غير مفعّل في Firebase Authentication."
    };
    showStatus(messages[error.code] || "تعذر تسجيل الدخول. تحقق من إعدادات Firebase ثم حاول مجددًا.", true);
  } finally {
    button.disabled = false;
  }
});

onAuthStateChanged(auth, user => {
  if (!button) return;
  button.dataset.signedIn = user ? "true" : "false";
  button.textContent = user
    ? "تسجيل الخروج (" + (user.displayName || "حساب Google") + ")"
    : "المتابعة باستخدام Google";
  button.setAttribute("aria-label", user ? "تسجيل الخروج من حساب Google" : "تسجيل الدخول باستخدام Google");
  showStatus(user ? "تم تسجيل الدخول باستخدام Google." : "");
});

