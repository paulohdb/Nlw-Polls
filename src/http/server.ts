import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { createPoll } from './routes/create-poll'
import { getPoll } from './routes/get-poll'
import { voteOnPoll } from './routes/vote-on-poll'
import websocket from '@fastify/websocket'
import { pollResults } from './ws/poll-results'
 
// Creating the main consts of the application
const app = fastify()

app.register(cookie, {
  secret: "donot-access-it",
  hook: "onRequest",
})

app.register(websocket)
app.register(createPoll)
app.register(getPoll)
app.register(voteOnPoll)
app.register(pollResults)

// Listening the default port 
app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!")
})

