import z from "zod"
import { randomUUID } from "node:crypto"
import { prisma } from "../../lib/prisma"
import { FastifyInstance } from "fastify"

export async function voteOnPoll(app: FastifyInstance) {
  // Using app.post to create the POST route
  app.post('/polls/:pollId/votes', async (request, reply) => {

    // Using zod as z, to verify the object of the request
    const voteOnPollBody = z.object({
      pollOptionId: z.string().uuid()
    })

    const voteOnPollParams = z.object({
      pollId: z.string().uuid()
    })

    const { pollId } = voteOnPollParams.parse(request.params)
    const { pollOptionId } = voteOnPollBody.parse(request.body)

    let { sessionId } = request.cookies

    if (sessionId) {
      const userPreviousVoteOnPoll = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId,
          },
        }
      })

      if (userPreviousVoteOnPoll && userPreviousVoteOnPoll.pollOptionId !== pollOptionId) {


        await prisma.vote.delete({
          where: {
            id: userPreviousVoteOnPoll.id,
          }
        })
      } else if (userPreviousVoteOnPoll) {
          return reply.status(400).send({ message: "You already voted!"})
      }
    }

    // Verify if the sessionId wasn't created before
    if (!sessionId) {
      sessionId = randomUUID()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 Days
        signed: true,
        httpOnly: true,
      })

    }
    
    await prisma.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId
      }
    })

    // returning the status code with the poll ID as an object
    return reply.status(201).send()
  })
}