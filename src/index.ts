import express from "express";
import cors    from "cors";
import * as dotenv  from "dotenv";

dotenv.config();

import "./db/firebase-config";
// import "./db/mysql";
import routes from "./routes";

const app = express();

// parsing application/json
app.use(express.json());

app.use(cors());

app.use(routes);

app.listen(process.env.PORT, () => {
    if( process.env.NODE_ENV === "development" )
        console.log(`SERVER started in port ${ process.env.PORT }`);
});
