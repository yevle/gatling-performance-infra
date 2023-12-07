import fs from 'fs'
import dotenv from 'dotenv'
import * as Encryptor from 'encryptor-node'

dotenv.config({ path: `${process.cwd()}/.env` })

export function parseJsonIntoObj(path) {
    const browserOptionsStr = fs.readFileSync(path).toString()
    return JSON.parse(browserOptionsStr)
}

export function decryptSlackToken() {
    return Encryptor.decrypt(`${process.env.SLACK_KEY}`, `${process.env.ENCRYPTED_SLACK_TOKEN}`)
}