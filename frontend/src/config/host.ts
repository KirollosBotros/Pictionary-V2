let host = null;

if (typeof window !== 'undefined') {
  if (window.location.hostname === 'playpictionary.me') {
    host = 'pictionary-v2-backend.herokuapp.com';
  } else {
    host = 'localhost:3001';
  }
}

export default host as string;