import cors from "cors"
import express, { Application, NextFunction, Request, Response, query } from "express"
 
const PORT = 8080;
 
const app = express();
app.use(cors())
app.use(express.json())
app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});
 
