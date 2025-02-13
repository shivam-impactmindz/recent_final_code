export const getHeaders = (request) => {
    let headers = {};
    
    // ✅ Use .forEach() to ensure compatibility across environments
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
  
    return headers;
  };
  