window.onload = function () {
  const apiSpecUrl = "https://michael-porto-api.vercel.app/docs"; // <-- change this if needed

  window.ui = SwaggerUIBundle({
    url: apiSpecUrl,
    dom_id: "#swagger-ui",
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis],
    layout: "BaseLayout",
  });
};
