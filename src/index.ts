import fastify, {FastifyRequest, FastifyReply} from 'fastify'
import session from '@fastify/session'
import cookie from '@fastify/cookie'
import { PrismaClient } from "prisma/prisma-client/scripts/default-index";
import * as crypto from "crypto";

const prisma = new PrismaClient()
const app = fastify()

app.register(session, {secret: });
app.register(cookie);



// app.get('/feed', async (req: FastifyRequest, res: FastifyReply) => {
//     const posts = await prisma.post.findMany({
//         where: { published: true },
//         include: { author: true },
//     })
//     res.send(posts);
// })
//
// app.post('/post', async (req:FastifyRequest, res: FastifyReply) => {
//     const { title, content, authorEmail } = req.body
//     const post = await prisma.post.create({
//         data: {
//             title,
//             content,
//             published: false,
//             author: { connect: { email: authorEmail } },
//         },
//     })
//     res.send(post)
// })

// app.put('/publish/:id', async (req, res) => {
//     const { id } = req.params
//     const post = await prisma.post.update({
//         where: { id },
//         data: { published: true },
//     })
//     res.json(post)
// })
//
// app.delete('/user/:id', async (req, res) => {
//     const { id } = req.params
//     const user = await prisma.user.delete({
//         where: {
//             id,
//         },
//     })
//     res.send(user)
// })

app.listen({ port: 3000 }, function (err, address) {
    if (err) {
        app.log.error(err)
        process.exit(1)
    }
    // Server is now listening on ${address}
})
