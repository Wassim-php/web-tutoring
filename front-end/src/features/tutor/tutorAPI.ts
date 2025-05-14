const BACKEND_URL = 'http://localhost:3000';

export async function fetchTutorProfile(id: number) {
  const response = await fetch(`${BACKEND_URL}/tutors/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.json();
}

export async function updateTutorProfile(id: number, profileData: any) {
  const response = await fetch(`${BACKEND_URL}/tutors/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(profileData)
  });
  return response.json();
}