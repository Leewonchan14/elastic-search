const INDEX_MAPPING = {
  mappings: {
    properties: {
      title: { type: "text", analyzer: "standard" },
      author: { type: "keyword" },
      genre: { type: "keyword" },
      publication_date: { type: "date" },
      pages: { type: "integer" },
      price: { type: "float" },
      description: { type: "text" },
      rating: { type: "float" },
    },
  },
};

export const createIndex = async () => {
  try {
    const resposne = await fetch("http://localhost:9200/books");
    if (resposne.status === 200) {
      console.log(JSON.stringify(await resposne.json(), null, 2));
      return { message: "Index already exists" };
    }
  } catch {
    const response = await fetch("http://localhost:9200/books", {
      method: "put",
      body: JSON.stringify(INDEX_MAPPING),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const body = await response.json();
    return body;
  }
};
