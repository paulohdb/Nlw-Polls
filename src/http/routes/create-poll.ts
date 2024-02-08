import z from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"
import { title } from "process"

export async function createPoll(app: FastifyInstance) {
  // Using app.post to create the POST route
  app.post('/polls', async (request, reply) => {

    // Using zod as z, to verify the object of the request
    const createPollBody = z.object({
      title: z.string(),
      options: z.array(z.string()),
    })


    const { title, options } = createPollBody.parse(request.body)

    // Communicating with the DB
    const poll = await prisma.poll.create({
      data: {
        title,
        options: {
          createMany: {
            data: options.map(option => {
              return { title: option }
            }),
          }
        }
      }
    })

    // returning the status code with the poll ID as an object
    return reply.status(201).send({ pollId: poll.id })
  })
}