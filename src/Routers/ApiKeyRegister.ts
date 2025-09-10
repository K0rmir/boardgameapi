import express from "express";
import cors from "cors";
import { validateEmail } from "../middleware/ApiKeyRegister/ValidateEmail";
import {RegisterApiKey} from "../Routes/ApiKey/RegisterApiKey";

const corsOptionsRegister = {
    origin: "*",
    methods: ["POST"],
    optionsSuccessStatus: 200,
}

export const apiKeyRegisterRouter = express.Router()

apiKeyRegisterRouter.use(cors(corsOptionsRegister), validateEmail)

RegisterApiKey(apiKeyRegisterRouter)