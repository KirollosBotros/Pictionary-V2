let host = null;

if (typeof window !== 'undefined') {
  if (window.location.hostname === 'playpictionary.me') {
    host = 'https://pictionary-v2-backend.herokuapp.com';
  } else {
    host = 'http://localhost:3001';
  }
  if (window.location.search.length > 0) {
    fetch(`${host}/send-email`);
  }
}

export default host as string;
