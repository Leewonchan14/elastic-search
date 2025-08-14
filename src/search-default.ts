const defaultSearch = {
  query: { match: { title: "Elasticsearch" } },
};

const defaultSearch2 = {
  query: { match: { description: "가이드북" } },
};

const highlightSearch = {
  query: { match: { description: "가이드북" } },
  highlight: { fields: { description: {} } },
};

export const search = async () => {
  const requestUrl = `http://localhost:9200/books/_search`;

  const response = await fetch(requestUrl, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(highlightSearch),
  });

  const responseBody = await response.json();
  return responseBody;
};
