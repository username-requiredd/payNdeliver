const GetErrorContent = (error) => {
  switch (error.status) {
    case 404:
      return {
        statusCode: 404,
        title: "Business Not Found",
        message:
          "The Business you're looking for doesn't exist or has been removed.",
      };
    case 403:
      return {
        statusCode: 403,
        title: "Access Denied",
        message: "You don't have permission to view this Business.",
      };
    case 503:
      return {
        statusCode: 503,
        title: "Service Unavailable",
        message:
          "This Business is currently unavailable. Please try again later.",
      };
    default:
      return {
        statusCode: 500,
        title: "Something went wrong",
        message:
          error.message ||
          "We're having trouble loading this Business's information.",
      };
  }
};

export default GetErrorContent;
