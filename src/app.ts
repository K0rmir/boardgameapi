import express from "express";
import {boardGamesRouter} from "./Routers/BoardGames";
import {apiKeyRegisterRouter} from "./Routers/ApiKeyRegister";
import helmet from "helmet";

export const app = express()

app.use(express.json())
app.use(helmet())

app.use("/boardgames", boardGamesRouter)
app.use("/boardRegister", apiKeyRegisterRouter)