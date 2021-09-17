let host = null;

if (typeof window !== 'undefined') {
  if (window.location.hostname === 'playpictionary.me') {
    host = 'https://pictionary-v2-backend.herokuapp.com';
  } else {
    host = 'http://localhost:3001';
  }
}

export default host as string;