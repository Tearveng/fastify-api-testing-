import fastify, {FastifyRequest, FastifyReply} from 'fastify'
import cookie from '@fastify/cookie'
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import cors from '@fastify/cors';
import phoneValid from 'google-libphonenumber';

const prisma = new PrismaClient();
const app = fastify()
const val = phoneValid.PhoneNumberUtil.getInstance();

app.register(cookie);
app.register(cors, {
    origin: 'http://localhost:3000',
    credentials: true
})

app.route({
    method: "POST",
    url: "/api/user/upload",
    handler: async (req: FastifyRequest, res: FastifyReply) => {
        const {first, last, email, password, phone}: any = req.body;

        const hasEmail = email.toLowerCase();
        const hashPassword = await bcrypt.hash(password, 10);

        const user =  await prisma.user.create({data: {
                first,
                last,
                email: hasEmail,
                password: hashPassword,
                phone
            }},
            )

        if(!user) throw new Error("Something went wrong");

        return res.send({
            id: user.id,
            username: `${user.first} ${user.last}`,
            email: user.email
        });
    }
})

app.get('/api/users', async (req: FastifyRequest, res: FastifyReply)=> {
    const users = await prisma.user.findMany();
    return res.send(users);
})

app.post('/api/user/login', async (req: FastifyRequest, res:FastifyReply) => {
    const {email, password}: any = req.body;

    const user = await prisma.user.findUnique({where: {email}});

    if(!user) throw new Error("User not found.");

    const hashPassword = await bcrypt.hash(password, user.password);

    if(!hashPassword) throw new Error("Incorrect password.")

    return res.send({
        id: user.id,
        email: user.email,
        username: `${user.first} ${user.last}`
    })
})

app.get("/api/validate/phone", async (req: FastifyRequest, res: FastifyReply) => {
    const number = val.parseAndKeepRawInput("0883608265", 'KH');

    const code = number.getCountryCode();
    const nationalNumber = number.getNationalNumber();
    const extension = number.getExtension();
    const numberaw = number.getRawInput();
    const validateLength = val.isPossibleNumber(number);
    const validatePhone = val.isValidNumber(number);
    const validatePhoneRegion = val.isValidNumberForRegion(number, 'KH');

    return res.send({
        code,
        nationalNumber,
        extension,
        numberaw,
        validateLength,
        validatePhone,
        validatePhoneRegion
    })
})

app.listen({ port: 5000 }, function (err, address) {
    if (err) {
        app.log.error(err)
        process.exit(1)
    }
    // Server is now listening on ${address}
    console.log(`Server is now listening on ${address}`)
})
