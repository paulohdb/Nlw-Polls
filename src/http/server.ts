import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
 
// Creating the main consts of the application
const app = fastify()
const prisma = new PrismaClient()


// Using app.post to create the POST route
app.post('/polls', async (request, reply) => {

  // Using zod as z, to verify the object of the request
  const createPollBody = z.object({
    title: z.string()
  })


  const { title } = createPollBody.parse(request.body)

  // Communicating with the DB, creating the title of the poll
  const poll = await prisma.poll.create({
    data: {
      title,
    }
  })

  // returning the status code with the poll ID as an object
  return reply.status(201).send({ pollId: poll.id })
})

// Listening the default port 
app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running!")
})

