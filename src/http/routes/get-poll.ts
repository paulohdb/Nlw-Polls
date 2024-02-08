import z from "zod"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

export async function getPoll(app: FastifyInstance) {
  // Using app.post to create the POST route
  app.get('/polls/:pollId', async (request, reply) => {

    // Using zod as z, to verify the object of the request
    const getPollParams = z.object({
      pollId: z.string().uuid(),
    })


    const { pollId } = getPollParams.parse(request.params)

    // Communicating with the DB
    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId,
      },

      include: {
        options: {
          select: {
            id: true,
            title: true,
          }
        }
      }
    })

    // returning the status code with the poll ID as an object
    return reply.send({ poll })
  })
}