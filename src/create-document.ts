// POST "http://localhost:9200/books/_doc"
const books = [
  {
    title: "Elasticsearch 완벽 가이드",
    author: "김엘라스틱",
    genre: "기술서",
    publication_date: "2024-01-15",
    pages: 500,
    price: 35000,
    description: "Elasticsearch를 처음부터 끝까지 다루는 완벽한 가이드북",
    rating: 4.8,
  },
  {
    title: "모던 웹 개발",
    author: "박웹개발",
    genre: "기술서",
    publication_date: "2023-06-20",
    pages: 400,
    price: 28000,
    description: "최신 웹 개발 트렌드와 실무 노하우",
    rating: 4.5,
  },
];

export const createDocument = async () => {
  const result = await Promise.allSettled(
    books.map(async (book) => {
      const response = await fetch("http://localhost:9200/books/_doc", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });

      const body = await response.json();
      console.log(book.title, body);
      // log doc id
      console.log(body._id);

      return body._id;
    })
  );

  return result.map((r) => r.status === "fulfilled" && r.value);
};
