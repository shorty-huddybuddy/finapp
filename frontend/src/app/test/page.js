'use client'; // Mark this as a Client Component
import { useAuth } from '@clerk/nextjs';

export default function ExternalDataPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  const fetchExternalData = async () => {
    const token = await getToken();
    console.log('Session Token:', token);

    const response = await fetch('http://localhost:8080/protected', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    console.log(data);
};

  // Show loading state
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Redirect or show a message if the user is not signed in
  if (!isSignedIn) {
    return <div>Sign in to view this page</div>;
  }

  return (
    <div>
      <h1>External Data Page</h1>
      <button onClick={fetchExternalData}>Fetch Data</button>
    </div>
  );
}