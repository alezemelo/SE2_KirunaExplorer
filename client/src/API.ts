



async function getDocuments() {
    const response = await fetch("http://localhost:3000/kiruna_explorer/documents/");
      if (!response.ok) throw new Error("Error fetching documents");
      return await response.json();
}

async function getLinks(id: number){
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
        });
    
        if (!response.ok) {
          throw new Error("Error: " + response.statusText);
        }
        const result = await response.json();
        console.log("res:", result);
      } catch (error) {
        console.error("Error:", error);
      }
}

async function addDocument(finalDocument: any){
    const response = await fetch("http://localhost:3000/kiruna_explorer/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalDocument),
      });


      if (!response.ok) {
        throw new Error("Error: " + response.statusText);
      }
      const result = await response.json();
      console.log("res:", result);
}

async function updateCoordinates(id: number, lat: string, lng: string) {
    try {
        const response = await fetch(`http://localhost:3000/kiruna_explorer/documents/${id}/coordinates`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat: parseFloat(lat), lng: parseFloat(lng) }),
        });

        if (!response.ok) throw new Error("Error: " + response.statusText);
        
      } catch (error) {
        console.error("Error:", error);
      }
}

async function updateDescription(id: number, description: string){
    try {
        const response = await fetch(`http://localhost:3000/kiruna_explorer/documents/${id}/description`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description }),
        });
  
        if (!response.ok) throw new Error("Error: " + response.statusText);
        
      } catch (error) {
        console.error("Error:", error);
      }
}

const API = {
    getDocuments,
    getLinks,
    getDocument,
    createLink,
    addDocument,
    updateCoordinates,
    updateDescription
}

export default API 