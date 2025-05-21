/**
 * API endpoint base URL for the backend server
 */
const BACKEND_URL = 'http://localhost:3000';

/**
 * Fetches a tutor's profile information from the server
 * 
 * @param {number} id - The ID of the tutor to fetch
 * @returns {Promise<any>} - Promise containing the tutor profile data
 */
export async function fetchTutorProfile(id: number) {
  const response = await fetch(`${BACKEND_URL}/tutors/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}` // Adds auth token from local storage
    }
  });
  return response.json();
}

/**
 * Updates a tutor's profile with new information
 * 
 * @param {number} id - The ID of the tutor to update
 * @param {any} profileData - The new profile data to save
 * @returns {Promise<any>} - Promise containing the updated profile data
 */
export async function updateTutorProfile(id: number, profileData: any) {
  const response = await fetch(`${BACKEND_URL}/tutors/${id}`, {
    method: 'PATCH', // Uses PATCH method to update only changed fields
    headers: {
      'Content-Type': 'application/json', // Specifies JSON content
      'Authorization': `Bearer ${localStorage.getItem('token')}` // Adds auth token from local storage
    },
    body: JSON.stringify(profileData) // Converts JS object to JSON string
  });
  return response.json();
}