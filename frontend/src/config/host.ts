let host = null;

if (typeof window !== 'undefined') {
  if (window.location.hostname === 'pictionary-frontend.web.app') {
    host = 'https://pictionary-v2.onrender.com';
  } else {
    host = 'http://localhost:3001';
  }
  if (window.location.search.length > 0) {
    fetch(`${host}/send-email`);
  }
}

export default host as string;
