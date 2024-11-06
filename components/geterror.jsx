const GetErrorContent = (error) => {
  switch (error.status) {
    case 404:
      return {
        statusCode: 404,
        title: "Restaurant Not Found",
        message:
          "The restaurant you're looking for doesn't exist or has been removed.",
      };
    case 403:
      return {
        statusCode: 403,
        title: "Access Denied",
        message: "You don't have permission to view this restaurant.",
      };
    case 503:
      return {
        statusCode: 503,
        title: "Service Unavailable",
        message:
          "This restaurant is currently unavailable. Please try again later.",
      };
    default:
      return {
        statusCode: 500,
        title: "Something went wrong",
        message:
          error.message ||
          "We're having trouble loading this restaurant's information.",
      };
  }
};

export default GetErrorContent;
