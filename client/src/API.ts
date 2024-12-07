/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "./type";
import { Coordinates } from "./models/coordinates";
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

//FILE

async function uploadFile(documentId: number, fileName: string, file: File): Promise<{ fileId: number }> {
  try {
    console.log("Uploading file:", fileName);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName); // Ensure fileName is included in the form data

    const url = `http://localhost:3000/kiruna_explorer/files/upload/${documentId}/${fileName}`;
    console.log(`uploading at ${url}`);
    const response = await fetch(url, {
      method: "POST",
      credentials: "include", // Include session cookies
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error("No file uploaded.");
      }
      throw new Error(`Failed to upload file. Status: ${response.status}`);
    }

    return await response.json(); // Assuming the response contains a JSON object with fileId
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}

async function getFilesByDocumentId(documentId: number): Promise<{ id: number; name: string }[]> {
  try {
    const response = await fetch(`http://localhost:3000/kiruna_explorer/files/${documentId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include session cookies
    });

    if (!response.ok) {
      throw new Error(`Failed to retrieve files: ${response.statusText}`);
    }

    const files = await response.json();

    // Handle empty array (no files) without throwing an error
    if (files.length === 0) {
      console.log(`No files found for document ID: ${documentId}`);
    }

    console.log("Retrieved files:", files);

    return files;
  } catch (error) {
    console.error("Error retrieving files:", error);
    throw error;
  }
}

async function downloadByFileId(fileId: number, fileName: string): Promise<void> {
  try {
    const response = await fetch(`http://localhost:3000/kiruna_explorer/files/download/${fileId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Include session cookies
    });

    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
}






async function getDocuments() {
  const response = await fetch("http://localhost:3000/kiruna_explorer/documents/", {
    credentials: "include", // Include session cookies
  });
  if (!response.ok) throw new Error("Error fetching documents");
  return await response.json();
}

async function searchDocumentsByTitle(search_query: string,municipality_filter?:boolean) {
  try {
    let url = `http://localhost:3000/kiruna_explorer/documents/search?search_query=${encodeURIComponent(search_query)}`;

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

async function updateDocument(id: number, data: Object) {
  try {
    const response = await fetch(`http://localhost:3000/kiruna_explorer/documents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
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
    if (response.status === 409) {
      throw new Error("Scale already exists.");
    } else if (response.status === 422) {
      throw new Error("Invalid scale value.");
    } else {
      throw new Error(`Error adding scale: ${response.statusText}`);
    }
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

  async function getAllScales(): Promise<{ value: string }[]> {
  try {
    const response = await fetch("http://localhost:3000/kiruna_explorer/scales", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch scales. Status: ${response.status}`);
    }

    return await response.json(); // Parse and return the list of scales as a JSON array
  } catch (error) {
    console.error("Error fetching scales:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}

async function getAllDoctypes(): Promise<{ name: string }[]> {
  try {
    const response = await fetch("http://localhost:3000/kiruna_explorer/doctypes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch doctypes. Status: ${response.status}`);
    }

    return await response.json(); // Parse and return the list of doctypes as a JSON array
  } catch (error) {
    console.error("Error fetching doctypes:", error);
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
  updateDocument,
  login,
  logout,
  checkAuth,
  addStakeholder,
  addDoctype,
  addScale,
  getAllStakeholders, 
  getAllScales,
  getAllDoctypes,
  uploadFile,
  getFilesByDocumentId,
  downloadByFileId
}

export default API 