import { User } from "./type";
import { Coordinates, CoordinatesAsPoint, CoordinatesType } from "./models/coordinates";
import { url } from "inspector";
async function checkAuth(): Promise<User | null> {
  try {
    const response = await fetch("http://localhost:3000/kiruna_explorer/sessions/current", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include session cookies
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("User not authenticated");
    }
  } catch (error) {
    console.error("Error checking authentication:", error);
    return null;
  }
}

async function login(username: string, password: string): Promise<User | null> {
  try {
    const response = await fetch("http://localhost:3000/kiruna_explorer/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include session cookies
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error("Login failed");

    const user: User = await response.json();
    console.log("Logged in:", user);
    return user;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}

async function logout(): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:3000/kiruna_explorer/sessions/current", {
      method: "DELETE",
      credentials: "include", // Include session cookies
    });

    if (response.ok) {
      console.log("Logged out successfully");
      return true;
    } else {
      throw new Error("Logout failed");
    }
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
}





async function getDocuments() {
  const response = await fetch("http://localhost:3000/kiruna_explorer/documents/", {
    credentials: "include", // Include session cookies
  });
  if (!response.ok) throw new Error("Error fetching documents");
  return await response.json();
}

async function searchDocumentsByTitle(title: string,municipality_filter?:boolean) {
  try {
    let url = `http://localhost:3000/kiruna_explorer/documents/search?title=${encodeURIComponent(title)}`;

    if (municipality_filter) {
      url += `&municipality_filter=${encodeURIComponent(municipality_filter)}`;
    }
      const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // Include session cookies
      });

    if (!response.ok) {
      throw new Error("Error fetching documents by title");
    }

    // Assuming the response body contains an array of documents
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}


async function getLinks(id: number) {
  const res = await fetch(`http://localhost:3000/kiruna_explorer/linkDocuments/${id}`);
  return await res.json();
}

async function getDocument(id: number) {
  const temp = await fetch(`http://localhost:3000/kiruna_explorer/documents/${id}`);
  return await temp.json();
}

async function createLink(doc_id1: number, doc_id2: number, link_type: string) {
    try {
        const response = await fetch("http://localhost:3000/kiruna_explorer/linkDocuments/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            doc_id1: doc_id1,
            doc_id2: doc_id2,
            link_type: link_type
          }),
          credentials: "include",
        });
    
        if (!response.ok) {
          throw new Error("Error: " + response.statusText);
        }
        const result = await response.json();
        console.log("res:", result);
        return result
      } catch (error) {
        console.error("Error:", error);
        throw error;
      }
}

// async function addDocument(finalDocument: any){
//     const response = await fetch('http://localhost:3000/kiruna_explorer/documents', {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(finalDocument),
//       });


//       if (!response.ok) {
//         throw new Error("Error: " + response.statusText);
//       }
//       const result = await response.json();
//       console.log("res:", result);
// }
async function addDocument(finalDocument: any) {
  const response = await fetch("http://localhost:3000/kiruna_explorer/documents", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(finalDocument),
  });

  if (!response.ok) {
    const errorDetails = await response.json(); // Check if error details exist
    throw new Error(errorDetails.message || `Error: ${response.statusText}`);
  }

  return response.json(); // Ensure this returns a valid JSON response
}


async function updateCoordinates(id: number, coordinates: Coordinates) {
  try {
    const response = await fetch(`http://localhost:3000/kiruna_explorer/documents/${id}/coordinates`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(coordinates),
      credentials: "include",
    });

    if (!response.ok) throw new Error("Error: " + response.statusText);

  } catch (error) {
    console.error("Error:", error);
  }
}

async function updateDescription(id: number, description: string) {
  try {
    const response = await fetch(`http://localhost:3000/kiruna_explorer/documents/${id}/description`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description }),
      credentials: "include",
    });

    if (!response.ok) throw new Error("Error: " + response.statusText);

  } catch (error) {
    console.error("Error:", error);
  }
}
async function addStakeholder(stakeholder: { name: string }): Promise<{ name: string }> {
  try {
    const response = await fetch("http://localhost:3000/kiruna_explorer/stakeholders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include cookies for authentication if needed
      body: JSON.stringify(stakeholder),
    });

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error("Stakeholder already exists.");
      }
      if (response.status === 422) {
        throw new Error("Invalid stakeholder name. It must be a non-empty string.");
      }
      throw new Error(`Failed to add stakeholder. Status: ${response.status}`);
    }

    return await response.json(); // Parse and return the response as a JSON object
  } catch (error) {
    console.error("Error adding stakeholder:", error);
    throw error; // Re-throw the error for caller to handle
  }
}



async function addDoctype(doctype: { name: string }): Promise<Response> {
  try {
    const response = await fetch('http://localhost:3000/kiruna_explorer/doctypes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary authorization headers here
      },
      credentials: 'include', // Include cookies if needed
      body: JSON.stringify(doctype),
    });

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('Doctype already exists.');
      }
      if (response.status === 422) {
        throw new Error('Invalid doctype name. It must be a non-empty string.');
      }
      throw new Error(`Failed to add doctype. Status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error('Error adding doctype:', error);
    throw error;
  }
}
async function addScale(data: { value: string }): Promise<Response> {
  const response = await fetch(`http://localhost:3000/kiruna_explorer/scales`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error adding scale: ${response.statusText}`);
  }

  return response;
}

async function getAllStakeholders(): Promise<{ name: string }[]> {
  try {
    const response = await fetch("http://localhost:3000/kiruna_explorer/stakeholders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch stakeholders. Status: ${response.status}`);
    }

    return await response.json(); // Parse and return the list of stakeholders as a JSON array
  } catch (error) {
    console.error("Error fetching stakeholders:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}




const API = {
  getDocuments,
  getLinks,
  getDocument,
  searchDocumentsByTitle,
  createLink,
  addDocument,
  updateCoordinates,
  updateDescription,
  login,
  logout,
  checkAuth,
  addStakeholder,
  addDoctype,
  addScale,
  getAllStakeholders
}

export default API 