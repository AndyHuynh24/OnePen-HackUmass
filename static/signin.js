
const clientId = '144566328850-70jc9qcm2vloij6rvft61g8adhla67kj.apps.googleusercontent.com';
const scope = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/drive.file'
].join(' ');

document.getElementById("signin-btn").onclick = () => {
    const redirectUri = window.location.origin + window.location.pathname;
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token id_token&scope=${encodeURIComponent(scope)}&nonce=random&prompt=consent`;
    window.location.href = oauthUrl;
};

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
}

function extractTokensFromUrl() {
    const hash = window.location.hash;
    if (!hash.includes('access_token')) return;

    const params = new URLSearchParams(hash.slice(1));
    const accessToken = params.get('access_token');
    const idToken = params.get('id_token');

    if (accessToken && idToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('idToken', idToken);

    // OPTIONAL: store user info if you want
    const user = parseJwt(idToken);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userName', user.name);



    // ✅ Redirect to index.html
    window.location.href = 'index.html';
    }
}

function signOut() {
  // Clear all stored auth info
  localStorage.removeItem('accessToken');
  localStorage.removeItem('idToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');

  // Optionally redirect to sign-in page or reload
  alert("✅ Signed out successfully.");
  window.location.href = window.location.pathname; // Reload without tokens
}

// Auto-run on load
extractTokensFromUrl();