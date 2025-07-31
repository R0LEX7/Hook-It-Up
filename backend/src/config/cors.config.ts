export const corsConfig = () => {
  const allowedOrigins = [
    "http://localhost:8081",
    "http://192.168.1.6:8081",
    "https://b_cilga-anonymous-8081.exp.direct",
  ];
  // const allowedOrigins = [
  //   "http://localhost:8081",
  //   "http://192.168.1.6:8081",
  //   "https://your-frontend.com",
  // ];

  const corsOptions = {
    origin: function (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // allow
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  };

  return corsOptions
};
