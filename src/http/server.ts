import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { createPoll } from './routes/create-poll'
import { getPoll } from './routes/get-poll'
import { voteOnPoll } from './routes/vote-on-poll'
 
// Creating the main consts of the application
const app = fastify()

app.register(cookie, {
  secret: "donot-access-it",
  hook: "onRequest",
})

app.register(createPoll)
app.register(getPoll)
app.register(voteOnPoll)

// Listening the default port 
app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!")
})

