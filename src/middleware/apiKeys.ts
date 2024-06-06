import express, { NextFunction, Request, Response } from "express";

const genKey = () => {
    return [...Array(30)]
        .map((e) => Math.floor(Math.random() * 36).toString(36))
        .join('')
}

console.log(genKey())

export function validateApiKey(req: Request, res: Response, next: NextFunction) {

    const apiKey = req.headers['x-api-key'];
    if (apiKey === 'xc55knmumgp7qgw4k0miqnov6y105x') {
        console.log('Api Key Match! You can proceed')
        next()
    } else {
        res.status(401).json({ error: 'Unauthorized. Api Key is missing or incorrect.' })
    }



}
















// module.exports(validateApiKey)